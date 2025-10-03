-- Add agency_logo_url column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS agency_logo_url TEXT;