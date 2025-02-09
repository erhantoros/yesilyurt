import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface CatalogPage {
  id: string;
  page_number: number;
  image_url: string;
}

export function useCatalog() {
  const [catalogPages, setCatalogPages] = useState<CatalogPage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCatalogPages = async () => {
    try {
      const { data, error } = await supabase
        .from('catalog_pages')
        .select('*')
        .order('page_number', { ascending: true });

      if (error) throw error;
      setCatalogPages(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Katalog sayfaları yüklenirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchCatalogPages();
  }, []);

  const addCatalogPage = async (file: File, pageNumber: number) => {
    setLoading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      const { error: uploadError } = await supabase.storage
        .from('catalog')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('catalog')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('catalog_pages')
        .insert({
          page_number: pageNumber,
          image_url: publicUrl
        });

      if (dbError) throw dbError;

      toast.success('Katalog sayfası başarıyla eklendi');
      fetchCatalogPages();
    } catch (error) {
      toast.error('Sayfa eklenirken bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCatalogPage = async (id: string, imageUrl: string) => {
    try {
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('catalog')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('catalog_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Sayfa başarıyla silindi');
      fetchCatalogPages();
    } catch (error) {
      toast.error('Silme işlemi başarısız oldu');
      console.error(error);
    }
  };

  return {
    catalogPages,
    loading,
    addCatalogPage,
    deleteCatalogPage,
    refreshCatalog: fetchCatalogPages
  };
}