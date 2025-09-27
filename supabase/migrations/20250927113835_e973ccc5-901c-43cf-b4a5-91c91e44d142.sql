-- Add new personal information fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN country TEXT,
ADD COLUMN city TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN timezone TEXT;