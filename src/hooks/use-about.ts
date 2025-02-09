import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface AboutContent {
  id: string;
  title: string;
  content: string;
  mission: string;
  vision: string;
  values: string[];
  history: string;
  team_members: {
    name: string;
    role: string;
    bio: string;
    image_url?: string;
  }[];
  image_url?: string;
  stats: {
    years_experience: number;
    completed_projects: number;
    team_size: number;
    client_satisfaction: number;
  };
}

export function useAbout() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      // Parse JSON fields if they are strings
      if (data) {
        if (typeof data.values === 'string') {
          data.values = JSON.parse(data.values);
        }
        if (typeof data.team_members === 'string') {
          data.team_members = JSON.parse(data.team_members);
        }
        if (typeof data.stats === 'string') {
          data.stats = JSON.parse(data.stats);
        }
      }

      setAboutContent(data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Hakkımızda içeriği yüklenirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const updateAboutContent = async (content: Partial<AboutContent>) => {
    if (!aboutContent) return;
    setLoading(true);
    
    try {
      // Convert arrays and objects to JSON strings if necessary
      const updateData = {
        ...content,
        values: Array.isArray(content.values) ? content.values : undefined,
        team_members: Array.isArray(content.team_members) ? content.team_members : undefined,
        stats: typeof content.stats === 'object' ? content.stats : undefined
      };

      const { error } = await supabase
        .from('about_content')
        .update(updateData)
        .eq('id', aboutContent.id);

      if (error) throw error;
      toast.success('Hakkımızda içeriği güncellendi');
      fetchAboutContent();
    } catch (error) {
      toast.error('Güncelleme sırasında bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadTeamMemberImage = async (file: File) => {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      const { error: uploadError } = await supabase.storage
        .from('team')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('team')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  return {
    aboutContent,
    loading,
    updateAboutContent,
    uploadTeamMemberImage,
    refreshAbout: fetchAboutContent
  };
}