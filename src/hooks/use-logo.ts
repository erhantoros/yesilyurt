import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface LogoSettings {
  id: string;
  header_logo: string;
  footer_logo: string;
}

export function useLogo() {
  const [logoSettings, setLogoSettings] = useState<LogoSettings | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLogoSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('logo_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setLogoSettings(data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Logo ayarları yüklenirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchLogoSettings();
  }, []);

  const updateLogo = async (file: File, type: 'header' | 'footer') => {
    if (!logoSettings) return;
    setLoading(true);
    
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      const updateData = type === 'header' 
        ? { header_logo: publicUrl }
        : { footer_logo: publicUrl };

      const { error } = await supabase
        .from('logo_settings')
        .update(updateData)
        .eq('id', logoSettings.id);

      if (error) throw error;
      toast.success('Logo başarıyla güncellendi');
      fetchLogoSettings();
    } catch (error) {
      toast.error('Logo güncellenirken bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    logoSettings,
    loading,
    updateLogo,
    refreshLogo: fetchLogoSettings
  };
}