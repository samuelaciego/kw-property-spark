-- Migration: Move OAuth tokens to Supabase Vault
-- This removes plain text token storage from profiles table and creates secure access functions

-- Step 1: Create functions to securely store and retrieve tokens from Vault
CREATE OR REPLACE FUNCTION public.store_oauth_token(
  _user_id uuid,
  _provider text,
  _token text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
BEGIN
  -- Store token in Vault with user-specific secret name
  INSERT INTO vault.secrets (name, secret)
  VALUES (
    'oauth_' || _provider || '_' || _user_id::text,
    _token
  )
  ON CONFLICT (name) 
  DO UPDATE SET 
    secret = EXCLUDED.secret,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.get_oauth_token(
  _user_id uuid,
  _provider text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  _token text;
BEGIN
  -- Retrieve token from Vault
  SELECT decrypted_secret INTO _token
  FROM vault.decrypted_secrets
  WHERE name = 'oauth_' || _provider || '_' || _user_id::text;
  
  RETURN _token;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_oauth_token(
  _user_id uuid,
  _provider text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
BEGIN
  -- Delete token from Vault
  DELETE FROM vault.secrets
  WHERE name = 'oauth_' || _provider || '_' || _user_id::text;
END;
$$;

-- Step 2: Migrate existing tokens to Vault (for non-null tokens)
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN 
    SELECT user_id, facebook_access_token, instagram_access_token, tiktok_access_token
    FROM public.profiles
    WHERE facebook_access_token IS NOT NULL 
       OR instagram_access_token IS NOT NULL 
       OR tiktok_access_token IS NOT NULL
  LOOP
    -- Migrate Facebook token
    IF profile_record.facebook_access_token IS NOT NULL THEN
      PERFORM public.store_oauth_token(
        profile_record.user_id, 
        'facebook', 
        profile_record.facebook_access_token
      );
    END IF;
    
    -- Migrate Instagram token
    IF profile_record.instagram_access_token IS NOT NULL THEN
      PERFORM public.store_oauth_token(
        profile_record.user_id, 
        'instagram', 
        profile_record.instagram_access_token
      );
    END IF;
    
    -- Migrate TikTok token
    IF profile_record.tiktok_access_token IS NOT NULL THEN
      PERFORM public.store_oauth_token(
        profile_record.user_id, 
        'tiktok', 
        profile_record.tiktok_access_token
      );
    END IF;
  END LOOP;
END;
$$;

-- Step 3: Remove token columns from profiles table
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS facebook_access_token,
  DROP COLUMN IF EXISTS instagram_access_token,
  DROP COLUMN IF EXISTS tiktok_access_token;

-- Step 4: Create trigger to clean up vault tokens when user is deleted
CREATE OR REPLACE FUNCTION public.cleanup_oauth_tokens_on_user_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.delete_oauth_token(OLD.user_id, 'facebook');
  PERFORM public.delete_oauth_token(OLD.user_id, 'instagram');
  PERFORM public.delete_oauth_token(OLD.user_id, 'tiktok');
  RETURN OLD;
END;
$$;

CREATE TRIGGER cleanup_oauth_tokens_trigger
  BEFORE DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_oauth_tokens_on_user_delete();