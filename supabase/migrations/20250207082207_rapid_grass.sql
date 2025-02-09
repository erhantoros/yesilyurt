/*
  # Politika Düzeltmeleri

  1. Değişiklikler
    - Çakışan politikaları kaldır
    - Yeni politikaları ekle
    - Eksik tabloları güncelle
*/

-- Drop all existing policies for catalog_pages
DROP POLICY IF EXISTS "Allow public read access to catalog_pages" ON catalog_pages;
DROP POLICY IF EXISTS "Allow authenticated users to manage catalog_pages" ON catalog_pages;
DROP POLICY IF EXISTS "catalog_pages_public_read" ON catalog_pages;
DROP POLICY IF EXISTS "catalog_pages_auth_all" ON catalog_pages;

-- Create new policies for catalog_pages with unique names
CREATE POLICY "catalog_pages_read_policy"
  ON catalog_pages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "catalog_pages_manage_policy"
  ON catalog_pages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure storage buckets exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM storage.buckets WHERE id = 'catalog'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('catalog', 'catalog', true);
  END IF;
END $$;