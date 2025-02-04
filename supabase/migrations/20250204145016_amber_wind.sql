/*
  # Add new features

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `image_url` (text)
      - `category` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `about_content`
      - `id` (uuid, primary key)
      - `content` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add new categories to gallery_items
    - Add blog and about management
*/

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- About Content Table
CREATE TABLE IF NOT EXISTS about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Policies for blog_posts
CREATE POLICY "Allow public read access to blog_posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage blog_posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for about_content
CREATE POLICY "Allow public read access to about_content"
  ON about_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage about_content"
  ON about_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON about_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert initial about content
INSERT INTO about_content (content, image_url)
VALUES (
  'Yeşilyurt Peyzaj olarak 20 yıllık deneyimimizle modern ve sürdürülebilir peyzaj çözümleri sunuyoruz.',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae'
) ON CONFLICT DO NOTHING;