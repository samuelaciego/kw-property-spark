-- Add DELETE policy for profiles table to allow users to delete their own profiles
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Add RLS policies for storage buckets to control access
-- Users can only upload/manage their own files, but anyone can view (needed for social sharing)
CREATE POLICY "Users can upload to agency-logos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'agency-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own files in agency-logos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'agency-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own files in agency-logos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'agency-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view agency-logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'agency-logos');

CREATE POLICY "Users can upload to property-images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own files in property-images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own files in property-images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view property-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-images');