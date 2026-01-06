import { useState, useEffect, useRef } from 'react';
import { 
  getOrCreateSessionId, 
  createChatSession, 
  sendUserMessage,
  sendAdminMessage,
  getChatHistory, 
  subscribeToChatMessages, 
  unsubscribeFromChatMessages,
  markMessagesAsRead,
  ChatMessage,
  ChatSession,
  supabaseChat
} from '../services/chatService';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<any>(null);

  // Initialize chat session
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const newSessionId = getOrCreateSessionId();
        setSessionId(newSessionId);

        // Create or get session (simplified)
        const chatSession = await createChatSession(newSessionId);
        setSession(chatSession);

        // Load chat history
        const history = await getChatHistory(newSessionId);
        setMessages(history);

        // Mark messages as read
        await markMessagesAsRead(newSessionId);

        console.log('✅ Chat initialized with session:', newSessionId);
        console.log('📊 Loaded messages:', history.length);
      } catch (error) {
        console.error('❌ Failed to initialize chat:', error);
      }
    };

    initializeChat();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    if (!sessionId) return;

    const setupRealTimeSubscription = () => {
      console.log('🔄 Setting up chat subscription for session:', sessionId);
      const channel = subscribeToChatMessages(
        sessionId, 
        (newMessage) => {
          console.log('💬 New message received via real-time:', newMessage);
          setMessages(prev => {
            // Check if message already exists (avoid duplicates from local temp messages)
            const messageExists = prev.some(msg => 
              msg.message === newMessage.message && 
              msg.role === newMessage.role && 
              Math.abs(new Date(msg.timestamp).getTime() - new Date(newMessage.timestamp).getTime()) < 5000
            );
            
            if (messageExists) {
              console.log('🔄 Message already exists locally, skipping duplicate');
              return prev;
            }
            
            console.log('📝 Adding new real-time message. Current count:', prev.length);
            const updated = [...prev, newMessage];
            console.log('📊 New message count:', updated.length);
            return updated;
          });
          
          // Mark as read if it's an assistant message
          if (newMessage.role === 'assistant') {
            markMessagesAsRead(sessionId);
          }
        },
        (isConnected) => {
          console.log('🔗 Connection status changed:', isConnected);
          setIsConnected(isConnected);
        }
      );
      
      channelRef.current = channel;
    };

    setupRealTimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channelRef.current) {
        unsubscribeFromChatMessages(channelRef.current);
        setIsConnected(false);
      }
    };
  }, [sessionId]);

  // Send user message
  const sendUserMessageFunc = async (message: string, userName?: string) => {
    try {
      // Add message locally for instant feedback
      const tempMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        session_id: sessionId || '',
        role: 'user',
        message,
        timestamp: new Date().toISOString(),
        user_id: undefined,
        is_read: false,
        user_name: userName // Include user name in local message
      };
      
      setMessages(prev => [...prev, tempMessage]);
      console.log('✅ User message added locally:', message);

      // Send to Supabase
      const sentMessage = await sendUserMessage(message, userName);
      
      // Replace temp message with real one
      setMessages(prev => 
        prev.map(msg => msg.id === tempMessage.id ? sentMessage : msg)
      );
      
      console.log('✅ User message sent to database:', sentMessage.id);
    } catch (error) {
      console.error('❌ Failed to send user message:', error);
      // Remove temp message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
      throw error;
    }
  };

  // Send assistant message (for support agent)
  const sendAssistantMessageFunc = async (message: string): Promise<void> => {
    if (!sessionId || !message.trim()) return;

    try {
      setIsLoading(true);
      
      // Add message locally immediately for instant feedback
      const tempMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        session_id: sessionId,
        role: 'assistant',
        message: message.trim(),
        timestamp: new Date().toISOString(),
        user_id: undefined,
        is_read: false,
        metadata: {}
      };
      
      setMessages(prev => [...prev, tempMessage]);
      console.log('✅ Assistant message added locally:', message);
      
      // Send to Supabase in background using the service function
      const { data } = await supabaseChat
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'assistant',
          message: message.trim(),
          timestamp: new Date().toISOString()
        })
        .select()
        .single();
      
      // Replace temp message with real one
      setMessages(prev => 
        prev.map(msg => msg.id === tempMessage.id ? data : msg)
      );
      
      console.log('✅ Assistant message sent to database');
    } catch (error) {
      console.error('❌ Failed to send assistant message:', error);
      // Remove the temp message if it failed to send
      setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
    } finally {
      setIsLoading(false);
    }
  };

  // Send admin message
  const sendAdminMessageFunc = async (message: string, adminName: string = 'Admin'): Promise<void> => {
    if (!sessionId || !message.trim()) return;

    try {
      setIsLoading(true);
      
      // Add message locally immediately for instant feedback
      const tempMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        session_id: sessionId,
        role: 'admin',
        message: message.trim(),
        timestamp: new Date().toISOString(),
        user_id: undefined,
        is_read: true,
        user_name: adminName
      };
      
      setMessages(prev => [...prev, tempMessage]);
      console.log('✅ Admin message added locally:', message);
      
      // Send to Supabase in background
      const sentMessage = await sendAdminMessage(message, adminName);
      
      // Replace temp message with real one
      setMessages(prev => 
        prev.map(msg => msg.id === tempMessage.id ? sentMessage : msg)
      );
      
      console.log('✅ Admin message sent to database');
    } catch (error) {
      console.error('❌ Failed to send admin message:', error);
      // Remove the temp message if it failed to send
      setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = async (): Promise<void> => {
    setMessages([]);
    // Note: In a real app, you might want to delete messages from the database too
  };

  // Get unread message count
  const getUnreadCount = (): number => {
    return messages.filter(msg => msg.role === 'assistant' && !msg.is_read).length;
  };

  return {
    messages,
    isLoading,
    sessionId,
    session,
    isConnected,
    sendUserMessage: sendUserMessageFunc,
    sendAssistantMessage: sendAssistantMessageFunc,
    sendAdminMessage: sendAdminMessageFunc,
    clearChat,
    getUnreadCount,
  };
};
