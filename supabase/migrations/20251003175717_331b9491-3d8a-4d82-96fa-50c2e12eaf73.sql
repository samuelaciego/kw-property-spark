-- Add new columns for Facebook and Stories generated images
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS generated_image_facebook TEXT,
ADD COLUMN IF NOT EXISTS generated_image_stories TEXT;