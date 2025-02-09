/*
  # Add initial content

  1. Changes
    - Add initial hero content
    - Add sample gallery items
  
  2. Data
    - Hero section content with title, description and background image
    - Three sample gallery items
*/

-- Insert initial hero content
INSERT INTO hero_content (title, description, background_image)
VALUES (
  'Hayalinizdeki Bahçeyi Birlikte Tasarlayalım',
  '20 yıllık deneyimimizle, modern peyzaj çözümleri sunuyoruz.',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae'
) ON CONFLICT DO NOTHING;

-- Insert sample gallery items
INSERT INTO gallery_items (title, description, category, image_url)
VALUES 
  (
    'Lavanta Bahçesi',
    'Göz alıcı mor rengiyle bahçelerinize güzellik katın',
    'Süs Bitkileri',
    'https://images.unsplash.com/photo-1468581264429-2548ef9eb732'
  ),
  (
    'Modern Peyzaj',
    'Şık ve modern tasarımlarla yaşam alanlarınızı güzelleştirin',
    'Tasarım',
    'https://images.unsplash.com/photo-1558293842-c0fd3db86157'
  ),
  (
    'Bahçe Düzenlemesi',
    'Profesyonel ekibimizle kusursuz bahçe düzenlemeleri',
    'Uygulama',
    'https://images.unsplash.com/photo-1598902108854-10e335adac99'
  ) ON CONFLICT DO NOTHING;