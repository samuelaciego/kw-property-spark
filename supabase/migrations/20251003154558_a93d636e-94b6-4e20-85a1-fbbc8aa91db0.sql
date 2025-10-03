-- Create public storage bucket for generated property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- RLS Policy: Users can upload to their own folder
CREATE POLICY "Users can upload own property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Anyone can view property images
CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Add columns for generated image URLs
ALTER TABLE properties 
ADD COLUMN generated_image_facebook TEXT,
ADD COLUMN generated_image_instagram TEXT,
ADD COLUMN generated_image_stories TEXT;