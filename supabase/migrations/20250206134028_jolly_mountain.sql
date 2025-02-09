/*
  # Update schema for new features

  1. Updates
    - Make title and description nullable in gallery_items
    - Add new catalog_pages table
    - Add new product_items table separate from gallery
    - Update contact information
  
  2. Changes
    - Modify existing tables
    - Add new tables
    - Update constraints
*/

-- Make title and description nullable in gallery_items
ALTER TABLE gallery_items 
ALTER COLUMN title DROP NOT NULL,
ALTER COLUMN description DROP NOT NULL;

-- Create catalog_pages table
CREATE TABLE IF NOT EXISTS catalog_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_number integer,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_items table
CREATE TABLE IF NOT EXISTS product_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  category text,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE catalog_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_items ENABLE ROW LEVEL SECURITY;

-- Policies for catalog_pages
CREATE POLICY "Allow public read access to catalog_pages"
  ON catalog_pages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage catalog_pages"
  ON catalog_pages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for product_items
CREATE POLICY "Allow public read access to product_items"
  ON product_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage product_items"
  ON product_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_catalog_pages_updated_at
  BEFORE UPDATE ON catalog_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_product_items_updated_at
  BEFORE UPDATE ON product_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Update contact information in a new table
CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text DEFAULT '+905416459107',
  address text DEFAULT 'Yeşilyurt Peyzaj Landscape, Eminceler, V392+PR, 07506, 07500 Serik/Antalya',
  email text DEFAULT 'info@yesilyurtpeyzaj.com.tr',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to contact_info"
  ON contact_info
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage contact_info"
  ON contact_info
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default contact info
INSERT INTO contact_info (phone, address, email)
VALUES (
  '+905416459107',
  'Yeşilyurt Peyzaj Landscape, Eminceler, V392+PR, 07506, 07500 Serik/Antalya',
  'info@yesilyurtpeyzaj.com.tr'
) ON CONFLICT DO NOTHING;