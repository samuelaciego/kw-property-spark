-- Create RLS policies for property-images bucket

-- Allow authenticated users to upload images for their properties
CREATE POLICY "Users can upload property images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.uid() IS NOT NULL
);

-- Allow authenticated users to read property images
CREATE POLICY "Users can view property images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'property-images');

-- Allow public access to read property images (since bucket is public)
CREATE POLICY "Public can view property images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Allow authenticated users to update their property images
CREATE POLICY "Users can update property images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images'
  AND auth.uid() IS NOT NULL
);

-- Allow authenticated users to delete their property images
CREATE POLICY "Users can delete property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images'
  AND auth.uid() IS NOT NULL
);