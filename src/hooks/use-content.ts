import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface HeroContent {
  title: string;
  description: string;
  background_image: string;
}

export interface AboutContent {
  content: string;
  image_url?: string;
}

export function useContent() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchContent = async () => {
    try {
      // Fetch hero content
      const { data: heroData, error: heroError } = await supabase
        .from('hero_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (heroError) throw heroError;
      setHeroContent(heroData);

      // Fetch about content
      const { data: aboutData, error: aboutError } = await supabase
        .from('about_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (aboutError) throw aboutError;
      setAboutContent(aboutData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('İçerik yüklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    heroContent,
    aboutContent,
    loading,
    refreshContent: fetchContent
  };
}