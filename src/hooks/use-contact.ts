import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ContactInfo {
  id: string;
  phone: string;
  email: string;
  address: string;
}

export function useContact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();

      if (error) throw error;
      setContactInfo(data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('İletişim bilgileri yüklenirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const updateContactInfo = async (phone: string, email: string, address: string) => {
    if (!contactInfo) return;
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('contact_info')
        .update({ phone, email, address })
        .eq('id', contactInfo.id);

      if (error) throw error;
      toast.success('İletişim bilgileri güncellendi');
      fetchContactInfo();
    } catch (error) {
      toast.error('Güncelleme sırasında bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    contactInfo,
    loading,
    updateContactInfo,
    refreshContact: fetchContactInfo
  };
}