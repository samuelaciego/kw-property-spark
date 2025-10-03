-- Add column for generated Instagram image
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS generated_image_instagram TEXT;