-- Phase 13: RLS Security Patch

-- 1. Profiles Table Patch
-- Drop the overly restrictive "Users can view their own profile" if we are replacing it, 
-- or simply add a new permissive policy. Adding a new one is safer and purely additive.

CREATE POLICY "Profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    USING (auth.role() = 'authenticated');

-- 2. Storage Policies Patch
-- Ensure the product-images bucket is publicly readable
DO $$
BEGIN
  -- Create policy to allow public access to product-images
  CREATE POLICY "Public Access to Product Images" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'product-images');

  -- Allow authenticated users to upload to product-images
  CREATE POLICY "Authenticated users can upload product images" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
EXCEPTION WHEN OTHERS THEN
  -- Ignore if already exists
END;
$$;
