/*
  # Politika Düzeltmeleri

  1. Değişiklikler
    - Çakışan politikaları kaldır
    - Yeni politikaları ekle
    - Eksik tabloları güncelle
*/

-- Drop conflicting policies if they exist
DO $$ 
BEGIN
  -- catalog_pages policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'catalog_pages'
  ) THEN
    DROP POLICY IF EXISTS "Allow public read access to catalog_pages" ON catalog_pages;
    DROP POLICY IF EXISTS "Allow authenticated users to manage catalog_pages" ON catalog_pages;
  END IF;

  -- product_items policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'product_items'
  ) THEN
    DROP POLICY IF EXISTS "Allow public read access to product_items" ON product_items;
    DROP POLICY IF EXISTS "Allow authenticated users to manage product_items" ON product_items;
  END IF;

  -- contact_info policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'contact_info'
  ) THEN
    DROP POLICY IF EXISTS "Allow public read access to contact_info" ON contact_info;
    DROP POLICY IF EXISTS "Allow authenticated users to manage contact_info" ON contact_info;
  END IF;
END $$;

-- Recreate policies with unique names
CREATE POLICY "catalog_pages_public_read"
  ON catalog_pages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "catalog_pages_auth_all"
  ON catalog_pages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "product_items_public_read"
  ON product_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "product_items_auth_all"
  ON product_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "contact_info_public_read"
  ON contact_info
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "contact_info_auth_all"
  ON contact_info
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('products', 'products', true),
  ('catalog', 'catalog', true)
ON CONFLICT DO NOTHING;

-- Storage policies for products bucket
CREATE POLICY "Products Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

CREATE POLICY "Products Auth Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Products Auth Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products' AND auth.uid() = owner);

CREATE POLICY "Products Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products' AND auth.uid() = owner);

-- Storage policies for catalog bucket
CREATE POLICY "Catalog Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'catalog');

CREATE POLICY "Catalog Auth Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'catalog');

CREATE POLICY "Catalog Auth Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'catalog' AND auth.uid() = owner);

CREATE POLICY "Catalog Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'catalog' AND auth.uid() = owner);