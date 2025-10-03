-- Create table for OAuth CSRF state management
CREATE TABLE IF NOT EXISTS public.oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access (edge functions)
CREATE POLICY "Service role full access" ON public.oauth_states
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for efficient lookups
CREATE INDEX idx_oauth_states_state ON public.oauth_states(state);
CREATE INDEX idx_oauth_states_expires_at ON public.oauth_states(expires_at);

-- Auto-cleanup expired states
CREATE OR REPLACE FUNCTION public.cleanup_expired_oauth_states()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.oauth_states WHERE expires_at < NOW();
END;
$$;