import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../src/config/supabase';

// Get Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || supabaseConfig.url;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || supabaseConfig.anonKey;

export const supabaseChat = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'admin'; // Added admin role
  message: string;
  timestamp: string;
  user_id?: string;
  user_name?: string;
  is_read: boolean;
  metadata?: any;
}

export interface ChatSession {
  id: string;
  session_id: string;
  user_name?: string;
  user_email?: string;
  status: 'active' | 'closed' | 'archived';
  created_at: string;
  updated_at: string;
  last_message: string;
  message_count: number;
}

// Generate or get session ID
export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('chat_session_id');
  
  // Clear problematic session IDs that are too long or contain old format
  if (sessionId && (sessionId.length > 100 || sessionId.includes('_1767'))) {
    console.log('🧹 Clearing problematic session ID:', sessionId);
    localStorage.removeItem('chat_session_id');
    sessionId = null;
  }
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
};

// Create new chat session (simplified version without custom function)
export const createChatSession = async (sessionId: string, userName?: string, userEmail?: string): Promise<ChatSession> => {
  try {
    // First try to get existing session
    const { data: existingSessions, error: fetchError } = await supabaseChat
      .from('chat_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .limit(1);

    if (existingSessions && existingSessions.length > 0) {
      console.log('✅ Found existing session:', existingSessions[0].session_id);
      return existingSessions[0];
    }

    // If no existing session, create new one with upsert to handle race conditions
    const { data, error } = await supabaseChat
      .from('chat_sessions')
      .upsert({
        session_id: sessionId,
        user_name: userName,
        user_email: userEmail,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'session_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      // If it's a duplicate key error, fetch the existing session
      if (error.code === '23505') {
        console.log('📝 Session already exists (race condition handled)');
        const { data: existingSessions } = await supabaseChat
          .from('chat_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .limit(1);
        
        if (existingSessions && existingSessions.length > 0) {
          return existingSessions[0];
        }
      }
      console.error('Error creating chat session:', error);
      throw error;
    }

    console.log('✅ Created new session:', data.session_id);
    return data;
  } catch (error: any) {
    console.error('Failed to create chat session:', error);
    throw error;
  }
};

// Send user message
export const sendUserMessage = async (message: string, userName?: string) => {
  try {
    console.log('📤 Sending user message:', message, userName ? `from ${userName}` : '');
    
    const sessionId = getOrCreateSessionId();
    const { data, error } = await supabaseChat
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'user',
        message: message,
        user_name: userName || 'Guest', // Include user name with message
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error sending user message:', error);
      throw error;
    }

    console.log('✅ User message sent successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to send user message:', error);
    throw error;
  }
};

// Send admin message
export const sendAdminMessage = async (message: string, userName: string = 'Admin') => {
  try {
    console.log('📤 Sending admin message:', message);
    
    const sessionId = getOrCreateSessionId();
    const { data, error } = await supabaseChat
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'admin',
        message: message,
        user_name: userName,
        timestamp: new Date().toISOString(),
        is_read: true
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error sending admin message:', error);
      throw error;
    }

    console.log('✅ Admin message sent successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to send admin message:', error);
    throw error;
  }
};

// Get chat history for a session
export const getChatHistory = async (sessionId: string): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabaseChat
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get chat history:', error);
    throw error;
  }
};

// Subscribe to real-time messages for a session
export const subscribeToChatMessages = (
  sessionId: string, 
  callback: (message: ChatMessage) => void,
  onConnectionChange?: (isConnected: boolean) => void
) => {
  console.log('🔄 Setting up real-time chat subscription for session:', sessionId);

  const channel = supabaseChat
    .channel(`chat-${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        console.log('💬 Real-time event received:', payload.eventType, payload.new);
        
        if (payload.eventType === 'INSERT') {
          callback(payload.new as ChatMessage);
        } else if (payload.eventType === 'UPDATE') {
          // Handle updates if needed
          callback(payload.new as ChatMessage);
        }
      }
    )
    .subscribe((status, err) => {
      console.log('📡 Chat subscription status:', status);
      
      // Handle subscription errors
      if (err) {
        console.error('❌ Real-time chat subscription error:', err);
        onConnectionChange?.(false);
        return;
      }
      
      if (status === 'SUBSCRIBED') {
        console.log('✅ Real-time chat subscription active!');
        onConnectionChange?.(true);
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Real-time chat subscription error');
        onConnectionChange?.(false);
      } else if (status === 'TIMED_OUT') {
        console.error('⏰ Real-time chat subscription timed out');
        onConnectionChange?.(false);
      } else {
        console.log('📡 Unknown chat subscription status:', status);
      }
    });

  return channel;
};

// Unsubscribe from chat messages
export const unsubscribeFromChatMessages = (channel: any) => {
  if (channel) {
    supabaseChat.removeChannel(channel);
    console.log('🔇 Unsubscribed from chat messages');
  }
};

// Get all active chat sessions (for admin/support)
export const getActiveChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const { data, error } = await supabaseChat
      .from('chat_sessions')
      .select('*')
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching active sessions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get active sessions:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (sessionId: string): Promise<void> => {
  try {
    const { error } = await supabaseChat
      .from('chat_messages')
      .update({ is_read: true })
      .eq('session_id', sessionId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    throw error;
  }
};
