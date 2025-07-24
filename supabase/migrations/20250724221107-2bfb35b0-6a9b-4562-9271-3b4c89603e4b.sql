-- Add separate column for user personal avatar
ALTER TABLE public.profiles 
ADD COLUMN user_avatar_url text;