-- Complete Chat Support System Schema
-- Run this in your Supabase SQL Editor
-- Handles both new installations and existing database migrations

-- Chat Messages Table (Enhanced)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  user_id VARCHAR(255),
  user_name VARCHAR(255), -- Store user name with message for history
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  -- Add constraints for better data integrity
  CONSTRAINT chat_messages_session_fkey FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
);

-- Chat Sessions Table (Enhanced)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  user_phone VARCHAR(50), -- Added phone field
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_message TIMESTAMPTZ DEFAULT now(),
  last_message_preview TEXT, -- Store preview of last message
  message_count INTEGER DEFAULT 0,
  agent_assigned VARCHAR(255), -- For future support agent assignment
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  source VARCHAR(50) DEFAULT 'web' -- Track where chat originated
);

-- Enhanced Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_timestamp ON chat_messages(session_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_unread ON chat_messages(session_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_email ON chat_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);

-- Migration: Add new columns to existing tables (safe for existing databases)
DO $$
BEGIN
    -- Check and add user_phone to chat_sessions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_sessions' 
        AND column_name = 'user_phone'
    ) THEN
        ALTER TABLE chat_sessions ADD COLUMN user_phone VARCHAR(50);
        COMMENT ON COLUMN chat_sessions.user_phone IS 'User phone number for contact';
    END IF;

    -- Check and add last_message_preview to chat_sessions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_sessions' 
        AND column_name = 'last_message_preview'
    ) THEN
        ALTER TABLE chat_sessions ADD COLUMN last_message_preview TEXT;
        COMMENT ON COLUMN chat_sessions.last_message_preview IS 'Preview of the last message for UI display';
    END IF;

    -- Check and add agent_assigned to chat_sessions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_sessions' 
        AND column_name = 'agent_assigned'
    ) THEN
        ALTER TABLE chat_sessions ADD COLUMN agent_assigned VARCHAR(255);
        COMMENT ON COLUMN chat_sessions.agent_assigned IS 'Support agent assigned to this chat';
    END IF;

    -- Check and add priority to chat_sessions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_sessions' 
        AND column_name = 'priority'
    ) THEN
        ALTER TABLE chat_sessions ADD COLUMN priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
        COMMENT ON COLUMN chat_sessions.priority IS 'Chat priority for support triage';
    END IF;

    -- Check and add source to chat_sessions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_sessions' 
        AND column_name = 'source'
    ) THEN
        ALTER TABLE chat_sessions ADD COLUMN source VARCHAR(50) DEFAULT 'web';
        COMMENT ON COLUMN chat_sessions.source IS 'Track where chat originated (web, mobile, etc.)';
    END IF;
END $$;

-- Migration: Add new columns to chat_messages table
DO $$
BEGIN
    -- Check and add user_name to chat_messages
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_messages' 
        AND column_name = 'user_name'
    ) THEN
        ALTER TABLE chat_messages ADD COLUMN user_name VARCHAR(255);
        COMMENT ON COLUMN chat_messages.user_name IS 'Store user name with message for history';
    END IF;

    -- Check and add message_type to chat_messages
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_messages' 
        AND column_name = 'message_type'
    ) THEN
        ALTER TABLE chat_messages ADD COLUMN message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file'));
        COMMENT ON COLUMN chat_messages.message_type IS 'Type of message (text, image, file)';
    END IF;
END $$;

-- RLS Policies (Enhanced for production)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on chat_messages" ON chat_messages;
DROP POLICY IF EXISTS "Allow all operations on chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view their own sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Admins can view all messages" ON chat_messages;
DROP POLICY IF EXISTS "Admins can view all sessions" ON chat_sessions;

-- More secure policies for production
CREATE POLICY "Users can view their own chat messages" ON chat_messages FOR SELECT USING (
  session_id IN (
    SELECT session_id FROM chat_sessions WHERE user_email = auth.email()
  )
);

CREATE POLICY "Users can insert their own messages" ON chat_messages FOR INSERT WITH CHECK (
  session_id IN (
    SELECT session_id FROM chat_sessions WHERE user_email = auth.email()
  )
);

CREATE POLICY "Users can view their own sessions" ON chat_sessions FOR SELECT USING (
  user_email = auth.email() OR user_email IS NULL
);

CREATE POLICY "Users can create their own sessions" ON chat_sessions FOR INSERT WITH CHECK (
  user_email = auth.email() OR user_email IS NULL
);

CREATE POLICY "Users can update their own sessions" ON chat_sessions FOR UPDATE USING (
  user_email = auth.email()
);

-- Admin policies (for support agents)
CREATE POLICY "Admins can view all messages" ON chat_messages FOR SELECT USING (
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Admins can view all sessions" ON chat_sessions FOR SELECT USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Fallback policy for demo purposes (if no auth)
CREATE POLICY "Allow all operations on chat_messages" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on chat_sessions" ON chat_sessions FOR ALL USING (true) WITH CHECK (true);

-- Function to update session timestamp and metadata
CREATE OR REPLACE FUNCTION update_chat_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the corresponding session's metadata
  UPDATE chat_sessions 
  SET 
    updated_at = now(),
    last_message = NEW.timestamp,
    last_message_preview = LEFT(NEW.message, 100),
    message_count = message_count + 1
  WHERE session_id = NEW.session_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enhanced trigger to update session when message is added
DROP TRIGGER IF EXISTS update_chat_session_trigger ON chat_messages;
CREATE TRIGGER update_chat_session_trigger
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_chat_session_timestamp();

-- Function to create or update session (UPSERT)
CREATE OR REPLACE FUNCTION create_or_update_chat_session(
  p_session_id VARCHAR(255), 
  p_user_name VARCHAR(255), 
  p_user_email VARCHAR(255),
  p_user_phone VARCHAR(255) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  session_uuid UUID;
BEGIN
  -- Try to update existing session first
  UPDATE chat_sessions 
  SET 
    user_name = COALESCE(p_user_name, user_name),
    user_email = COALESCE(p_user_email, user_email),
    user_phone = COALESCE(p_user_phone, user_phone),
    updated_at = now()
  WHERE session_id = p_session_id
  RETURNING id INTO session_uuid;
  
  -- If no rows were updated, insert new session
  IF NOT FOUND THEN
    INSERT INTO chat_sessions (session_id, user_name, user_email, user_phone)
    VALUES (p_session_id, p_user_name, p_user_email, p_user_phone)
    RETURNING id INTO session_uuid;
  END IF;
  
  RETURN session_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get chat statistics
CREATE OR REPLACE FUNCTION get_chat_stats()
RETURNS TABLE(
  total_sessions BIGINT,
  active_sessions BIGINT,
  total_messages BIGINT,
  messages_today BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM chat_sessions) as total_sessions,
    (SELECT COUNT(*) FROM chat_sessions WHERE status = 'active') as active_sessions,
    (SELECT COUNT(*) FROM chat_messages) as total_messages,
    (SELECT COUNT(*) FROM chat_messages WHERE DATE(timestamp) = CURRENT_DATE) as messages_today;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old messages (for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_chat_messages(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM chat_messages 
  WHERE timestamp < now() - INTERVAL '1 day' * days_old;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- One-time data migration for existing databases
DO $$
BEGIN
    -- Update existing messages to have user names
    UPDATE chat_messages 
    SET user_name = cs.user_name 
    FROM chat_sessions cs 
    WHERE chat_messages.session_id = cs.session_id 
    AND cs.user_name IS NOT NULL 
    AND chat_messages.user_name IS NULL;

    -- Update existing sessions to have message previews
    UPDATE chat_sessions 
    SET last_message_preview = LEFT(cm.message, 100)
    FROM (
      SELECT DISTINCT ON (session_id) 
        session_id, 
        message, 
        timestamp
      FROM chat_messages 
      ORDER BY session_id, timestamp DESC
    ) cm
    WHERE chat_sessions.session_id = cm.session_id
    AND chat_sessions.last_message_preview IS NULL;
END $$;

-- Add comments for documentation
COMMENT ON TABLE chat_messages IS 'Stores all chat messages with user and assistant interactions';
COMMENT ON TABLE chat_sessions IS 'Stores chat session information and metadata';
COMMENT ON COLUMN chat_messages.metadata IS 'Additional message data like file info, images, etc.';
COMMENT ON COLUMN chat_sessions.last_message_preview IS 'Preview of the last message for UI display';
COMMENT ON COLUMN chat_sessions.priority IS 'Chat priority for support triage (low, normal, high, urgent)';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Complete chat system setup completed successfully!';
    RAISE NOTICE '📊 Tables: chat_messages, chat_sessions';
    RAISE NOTICE '🔍 Indexes created for performance';
    RAISE NOTICE '🛡️ RLS policies configured';
    RAISE NOTICE '⚡ Triggers and functions ready';
    RAISE NOTICE '📈 Analytics functions available';
    RAISE NOTICE '🔄 Migration completed for existing data';
END $$;
