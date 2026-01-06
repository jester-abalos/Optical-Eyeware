-- Chat Database Migration Script
-- Run this in your Supabase SQL Editor to update existing chat tables

-- Add new columns to chat_sessions table (IF NOT EXISTS pattern)
DO $$
BEGIN
    -- Check if column exists before adding
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_sessions' 
        AND column_name = 'user_phone'
    ) THEN
        ALTER TABLE chat_sessions ADD COLUMN user_phone VARCHAR(50);
        COMMENT ON COLUMN chat_sessions.user_phone IS 'User phone number for contact';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_sessions' 
        AND column_name = 'last_message_preview'
    ) THEN
        ALTER TABLE chat_sessions ADD COLUMN last_message_preview TEXT;
        COMMENT ON COLUMN chat_sessions.last_message_preview IS 'Preview of the last message for UI display';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_sessions' 
        AND column_name = 'agent_assigned'
    ) THEN
        ALTER TABLE chat_sessions ADD COLUMN agent_assigned VARCHAR(255);
        COMMENT ON COLUMN chat_sessions.agent_assigned IS 'Support agent assigned to this chat';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_sessions' 
        AND column_name = 'priority'
    ) THEN
        ALTER TABLE chat_sessions ADD COLUMN priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
        COMMENT ON COLUMN chat_sessions.priority IS 'Chat priority for support triage';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_sessions' 
        AND column_name = 'source'
    ) THEN
        ALTER TABLE chat_sessions ADD COLUMN source VARCHAR(50) DEFAULT 'web';
        COMMENT ON COLUMN chat_sessions.source IS 'Track where chat originated (web, mobile, etc.)';
    END IF;
END $$;

-- Add new columns to chat_messages table
DO $$
BEGIN
    -- Check if column exists before adding
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_messages' 
        AND column_name = 'user_name'
    ) THEN
        ALTER TABLE chat_messages ADD COLUMN user_name VARCHAR(255);
        COMMENT ON COLUMN chat_messages.user_name IS 'Store user name with message for history';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_messages' 
        AND column_name = 'message_type'
    ) THEN
        ALTER TABLE chat_messages ADD COLUMN message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file'));
        COMMENT ON COLUMN chat_messages.message_type IS 'Type of message (text, image, file)';
    END IF;
END $$;

-- Add new indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_email ON chat_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_chat_session_trigger ON chat_messages;

-- Update the trigger function to handle the new column
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

-- Recreate the trigger
CREATE TRIGGER update_chat_session_trigger
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_chat_session_timestamp();

-- Create enhanced functions
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

-- Create analytics function
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

-- Create maintenance function
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

-- Update existing messages to have user names (one-time migration)
UPDATE chat_messages 
SET user_name = cs.user_name 
FROM chat_sessions cs 
WHERE chat_messages.session_id = cs.session_id 
AND cs.user_name IS NOT NULL 
AND chat_messages.user_name IS NULL;

-- Update existing sessions to have message previews (one-time migration)
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

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Chat database migration completed successfully!';
    RAISE NOTICE '📊 Added new columns: user_phone, last_message_preview, agent_assigned, priority, source';
    RAISE NOTICE '💬 Added message columns: user_name, message_type';
    RAISE NOTICE '🔍 Added new indexes for performance';
    RAISE NOTICE '⚡ Updated trigger and functions';
END $$;
