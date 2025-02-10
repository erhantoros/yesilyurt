/*
  # Fix gallery and product categories

  1. Updates
    - Standardize gallery categories
    - Standardize product categories
    - Update existing items to use correct categories
*/

-- Update gallery items categories
UPDATE gallery_items 
SET category = CASE 
  WHEN category ILIKE '%uygulama%' THEN 'Uygulama'
  WHEN category ILIKE '%üretim%' THEN 'Üretim'
  WHEN category ILIKE '%çizim%' THEN 'Çizim'
  WHEN category ILIKE '%tasarım%' THEN 'Tasarım'
  ELSE category
END
WHERE category IS NOT NULL;

-- Update product items categories
UPDATE product_items 
SET category = CASE 
  WHEN category ILIKE '%ağaç%' THEN 'Ağaçlar'
  WHEN category ILIKE '%çiçek%' THEN 'Çiçekler'
  WHEN category ILIKE '%çim%' THEN 'Çim'
  WHEN category ILIKE '%fidan%' THEN 'Fidanlar'
  ELSE category
END
WHERE category IS NOT NULL;