-- Add language field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN language VARCHAR(2) DEFAULT 'en' CHECK (language IN ('en', 'es'));