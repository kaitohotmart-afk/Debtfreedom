-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_name TEXT NOT NULL,
    page_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for public funnel tracking)
CREATE POLICY "Allow anonymous inserts" ON public.analytics_events
    FOR INSERT WITH CHECK (true);

-- Only admins can view analytics data
-- Admin email check (user is admin if their email is ktz@example.com - adjust as needed)
CREATE POLICY "Only admins can view analytics" ON public.analytics_events
    FOR SELECT USING (
        auth.jwt() ->> 'email' = 'ktz@sa.com' -- Substitute with the actual admin email
    );

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON public.analytics_events(session_id);
