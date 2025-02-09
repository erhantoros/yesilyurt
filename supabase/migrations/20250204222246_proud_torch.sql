/*
  # Create Storage Buckets

  1. New Storage Buckets
    - `gallery` bucket for storing gallery images
    - Public access enabled for reading
    - Only authenticated users can upload

  2. Security
    - RLS policies for secure access
*/

-- Create the gallery bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT DO NOTHING;

-- Allow public access to gallery bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- Allow authenticated users to upload to gallery bucket
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update own uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery' AND auth.uid() = owner);

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated users can delete own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery' AND auth.uid() = owner);