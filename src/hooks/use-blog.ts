import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  created_at: string;
}

export function useBlog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      toast.error('Blog yazıları yüklenirken hata oluştu');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const addBlogPost = async (title: string, content: string, category: string, image?: File) => {
    setLoading(true);
    try {
      let imageUrl = '';
      
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from('blog')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('blog')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title,
          content,
          category,
          image_url: imageUrl
        });

      if (error) throw error;

      toast.success('Blog yazısı başarıyla eklendi');
      fetchBlogPosts();
    } catch (error) {
      toast.error('Blog yazısı eklenirken bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    blogPosts,
    loading,
    addBlogPost,
    refreshBlog: fetchBlogPosts
  };
}