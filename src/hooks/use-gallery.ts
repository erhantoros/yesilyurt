import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface GalleryItem {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  image_url: string;
}

export function useGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Galeri öğeleri yüklenirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const addGalleryItem = async (file: File, title?: string, description?: string, category?: string) => {
    setLoading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('gallery_items')
        .insert({
          title,
          description,
          category,
          image_url: publicUrl
        });

      if (dbError) throw dbError;

      toast.success('Galeri öğesi başarıyla eklendi');
      fetchGalleryItems();
    } catch (error) {
      toast.error('Yükleme sırasında bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryItem = async (id: string, imageUrl: string) => {
    try {
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('gallery')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Öğe başarıyla silindi');
      fetchGalleryItems();
    } catch (error) {
      toast.error('Silme işlemi başarısız oldu');
      console.error(error);
    }
  };

  return {
    galleryItems,
    loading,
    addGalleryItem,
    deleteGalleryItem,
    refreshGallery: fetchGalleryItems
  };
}