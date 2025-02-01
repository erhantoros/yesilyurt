import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AuthForm } from '@/components/ui/auth-form';
import { User } from '@supabase/supabase-js';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    // Mevcut oturumu kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Oturum değişikliklerini dinle
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchGalleryItems();
    }
  }, [user]);

  const fetchGalleryItems = async () => {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Galeri öğeleri yüklenirken hata oluştu');
      return;
    }

    if (data) {
      setGalleryItems(data);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (const image of images) {
        const fileName = `${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, image);

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
      }

      toast.success('Galeri öğesi başarıyla eklendi');
      setTitle('');
      setDescription('');
      setCategory('');
      setImages([]);
      fetchGalleryItems();
    } catch (error) {
      toast.error('Bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Paneli
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Devam etmek için giriş yapın
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Galeri Yönetimi</h1>
        <Button 
          variant="outline" 
          onClick={() => supabase.auth.signOut()}
        >
          Çıkış Yap
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Resimler</label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Başlık</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Açıklama</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Ekle'}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {galleryItems.map((item: GalleryItem) => (
          <div key={item.id} className="bg-white border rounded-lg p-4">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
            <p className="text-gray-500 text-xs mb-4">{item.category}</p>
            <Button
              variant="destructive"
              onClick={() => handleDelete(item.id, item.image_url)}
            >
              Sil
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;