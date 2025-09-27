-- Add columns to track social media posts
ALTER TABLE public.properties 
ADD COLUMN facebook_post_id TEXT,
ADD COLUMN facebook_published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN instagram_post_id TEXT,
ADD COLUMN instagram_published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN tiktok_video_id TEXT,
ADD COLUMN tiktok_published_at TIMESTAMP WITH TIME ZONE;