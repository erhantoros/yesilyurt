-- Update about_content table with new fields
ALTER TABLE about_content
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS mission text,
ADD COLUMN IF NOT EXISTS vision text,
ADD COLUMN IF NOT EXISTS values text[],
ADD COLUMN IF NOT EXISTS history text,
ADD COLUMN IF NOT EXISTS team_members jsonb[],
ADD COLUMN IF NOT EXISTS stats jsonb;

-- Create team storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('team', 'team', true)
ON CONFLICT DO NOTHING;

-- Storage policies for team bucket
CREATE POLICY "Team Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'team');

CREATE POLICY "Team Auth Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'team');

CREATE POLICY "Team Auth Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'team' AND auth.uid() = owner);

CREATE POLICY "Team Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'team' AND auth.uid() = owner);

-- Insert default about content if not exists
INSERT INTO about_content (
  title,
  content,
  mission,
  vision,
  values,
  history,
  team_members,
  stats
) VALUES (
  'Yeşilyurt Peyzaj',
  'Modern ve sürdürülebilir peyzaj çözümleri sunuyoruz.',
  'Doğa ile uyumlu, sürdürülebilir ve estetik peyzaj çözümleri sunarak yaşam alanlarını güzelleştirmek.',
  'Türkiye''nin lider peyzaj şirketi olmak ve uluslararası standartlarda hizmet sunmak.',
  ARRAY['Kalite', 'Sürdürülebilirlik', 'Müşteri Memnuniyeti', 'Yenilikçilik'],
  '2004 yılında kurulan şirketimiz, 20 yıllık deneyimiyle sektörün öncü firmalarından biri haline gelmiştir.',
  ARRAY[
    '{"name": "Ahmet Yeşilyurt", "role": "Kurucu", "bio": "20 yıllık sektör deneyimi"}'::jsonb,
    '{"name": "Mehmet Yeşil", "role": "Baş Tasarımcı", "bio": "15 yıllık tasarım deneyimi"}'::jsonb
  ],
  '{"years_experience": 20, "completed_projects": 500, "team_size": 30, "client_satisfaction": 98}'::jsonb
) ON CONFLICT DO NOTHING;