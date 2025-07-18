-- Add social media connections to profiles table
ALTER TABLE public.profiles 
ADD COLUMN facebook_connected boolean DEFAULT false,
ADD COLUMN facebook_page_id text,
ADD COLUMN facebook_access_token text,
ADD COLUMN instagram_connected boolean DEFAULT false,
ADD COLUMN instagram_account_id text,
ADD COLUMN instagram_access_token text,
ADD COLUMN tiktok_connected boolean DEFAULT false,
ADD COLUMN tiktok_username text,
ADD COLUMN tiktok_access_token text;