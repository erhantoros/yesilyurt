/*
  # Galeri ve İçerik Yönetim Sistemi

  1. Yeni Tablolar
    - `gallery_items`
      - `id` (uuid, primary key)
      - `title` (text) - Bitkinin adı
      - `description` (text) - Açıklama
      - `image_url` (text) - Resim URL'i
      - `category` (text) - Kategori
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `hero_content`
      - `id` (uuid, primary key)
      - `title` (text) - Ana başlık
      - `description` (text) - Açıklama
      - `background_image` (text) - Arka plan resmi URL'i
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage content
*/

-- Gallery Items Table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hero Content Table
CREATE TABLE IF NOT EXISTS hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  background_image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

-- Policies for gallery_items
CREATE POLICY "Allow public read access to gallery_items"
  ON gallery_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage gallery_items"
  ON gallery_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for hero_content
CREATE POLICY "Allow public read access to hero_content"
  ON hero_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage hero_content"
  ON hero_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON gallery_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hero_content_updated_at
  BEFORE UPDATE ON hero_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();