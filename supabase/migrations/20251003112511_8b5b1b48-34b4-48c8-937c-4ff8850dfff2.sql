-- Add separate columns for each platform's AI-generated content
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS facebook_content TEXT,
ADD COLUMN IF NOT EXISTS instagram_content TEXT,
ADD COLUMN IF NOT EXISTS tiktok_content TEXT;

-- Drop the old social_content column if it exists
ALTER TABLE properties 
DROP COLUMN IF EXISTS social_content;