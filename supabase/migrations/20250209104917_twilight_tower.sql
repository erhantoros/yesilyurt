/*
  # Logo Settings Table

  1. New Tables
    - `logo_settings`
      - `id` (uuid, primary key)
      - `header_logo` (text)
      - `footer_logo` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `logo_settings` table
    - Add policies for public read access
    - Add policies for authenticated users to manage settings

  3. Storage
    - Create logos bucket for storing logo files
    - Add storage policies for public access and authenticated management
*/

-- Create logo_settings table
CREATE TABLE IF NOT EXISTS logo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  header_logo text,
  footer_logo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE logo_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "logo_settings_public_read"
  ON logo_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "logo_settings_auth_all"
  ON logo_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_logo_settings_updated_at
  BEFORE UPDATE ON logo_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT DO NOTHING;

-- Storage policies for logos bucket
CREATE POLICY "Logos Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

CREATE POLICY "Logos Auth Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Logos Auth Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'logos' AND auth.uid() = owner);

CREATE POLICY "Logos Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'logos' AND auth.uid() = owner);

-- Insert default logo settings
INSERT INTO logo_settings (header_logo, footer_logo)
VALUES (
  '/logo.png',
  '/logo.png'
) ON CONFLICT DO NOTHING;