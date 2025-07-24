-- Kumar Prescod Boxing Contact Form Database Schema
-- This schema creates the necessary tables for storing contact form submissions
-- Compatible with PostgreSQL/Neon Database

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    inquiry_type VARCHAR(50) NOT NULL DEFAULT 'general',
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    admin_notes TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_inquiry_type CHECK (inquiry_type IN (
        'general', 'sponsorship', 'media', 'training', 'booking', 
        'merchandise', 'partnership', 'fan_mail', 'press', 'collaboration'
    )),
    CONSTRAINT valid_status CHECK (status IN (
        'new', 'read', 'in_progress', 'resolved', 'spam', 'archived'
    )),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_inquiry_type ON contact_messages(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create contact_analytics table for tracking form usage
CREATE TABLE IF NOT EXISTS contact_analytics (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES contact_messages(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    form_load_time TIMESTAMP WITH TIME ZONE,
    form_submit_time TIMESTAMP WITH TIME ZONE,
    response_time_ms INTEGER, -- Time taken to fill form
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for analytics
CREATE INDEX IF NOT EXISTS idx_contact_analytics_message_id ON contact_analytics(message_id);
CREATE INDEX IF NOT EXISTS idx_contact_analytics_created_at ON contact_analytics(created_at);

-- Insert sample data for testing (optional - remove in production)
-- INSERT INTO contact_messages (name, email, subject, message, inquiry_type) VALUES
-- ('Test User', 'test@example.com', 'Test Message', 'This is a test message for the contact form.', 'general');

-- Create view for message statistics
CREATE OR REPLACE VIEW contact_message_stats AS
SELECT 
    status,
    inquiry_type,
    COUNT(*) as count,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
FROM contact_messages 
GROUP BY status, inquiry_type
ORDER BY count DESC;

-- Create view for response time analytics
CREATE OR REPLACE VIEW contact_response_times AS
SELECT 
    inquiry_type,
    AVG(EXTRACT(EPOCH FROM (response_date - created_at))/3600) as avg_response_hours,
    COUNT(*) as total_messages,
    COUNT(CASE WHEN response_date IS NOT NULL THEN 1 END) as responded_messages
FROM contact_messages 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY inquiry_type
ORDER BY avg_response_hours;

-- Function to get contact form statistics
CREATE OR REPLACE FUNCTION get_contact_statistics(days_back INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_messages', (
            SELECT COUNT(*) 
            FROM contact_messages 
            WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
        ),
        'messages_by_status', (
            SELECT json_object_agg(status, count)
            FROM (
                SELECT status, COUNT(*) as count
                FROM contact_messages 
                WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
                GROUP BY status
            ) t
        ),
        'messages_by_inquiry_type', (
            SELECT json_object_agg(inquiry_type, count)
            FROM (
                SELECT inquiry_type, COUNT(*) as count
                FROM contact_messages 
                WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
                GROUP BY inquiry_type
            ) t
        ),
        'avg_response_time_hours', (
            SELECT AVG(EXTRACT(EPOCH FROM (response_date - created_at))/3600)
            FROM contact_messages 
            WHERE response_date IS NOT NULL 
            AND created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to mark message as read
CREATE OR REPLACE FUNCTION mark_message_read(message_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE contact_messages 
    SET status = 'read', updated_at = CURRENT_TIMESTAMP
    WHERE id = message_id AND status = 'new';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to bulk update message status
CREATE OR REPLACE FUNCTION bulk_update_message_status(
    message_ids INTEGER[],
    new_status VARCHAR(50),
    admin_note TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE contact_messages 
    SET 
        status = new_status,
        admin_notes = COALESCE(admin_note, admin_notes),
        updated_at = CURRENT_TIMESTAMP,
        response_date = CASE 
            WHEN new_status = 'resolved' AND response_date IS NULL 
            THEN CURRENT_TIMESTAMP 
            ELSE response_date 
        END
    WHERE id = ANY(message_ids);
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON contact_messages TO your_app_user;
-- GRANT SELECT, INSERT ON contact_analytics TO your_app_user;
-- GRANT USAGE ON SEQUENCE contact_messages_id_seq TO your_app_user;
-- GRANT USAGE ON SEQUENCE contact_analytics_id_seq TO your_app_user;