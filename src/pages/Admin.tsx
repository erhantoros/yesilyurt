import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AuthForm } from '@/components/ui/auth-form';
import { User } from '@supabase/supabase-js';
import { 
  BarChart3, 
  Image as ImageIcon, 
  Home, 
  Settings, 
  Users, 
  LogOut,
  PenTool,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  created_at: string;
}

interface AboutContent {
  id: string;
  content: string;
  image_url?: string;
}

interface HeroContent {
  id: string;
  title: string;
  description: string;
  background_image: string;
}

interface Stats {
  totalImages: number;
  categoriesCount: { [key: string]: number };
  recentUploads: number;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalImages: 0,
    categoriesCount: {},
    recentUploads: 0
  });

  // Blog form states
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogImage, setBlogImage] = useState<File | null>(null);

  const categories = [
    "Uygulama",
    "Üretim",
    "Çizim",
    "Tasarım"
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchGalleryItems();
      fetchBlogPosts();
      fetchAboutContent();
      fetchHeroContent();
    }
  }, [user]);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
      calculateStats(data);
    } catch (error) {
      toast.error('Galeri öğeleri yüklenirken hata oluştu');
      console.error(error);
    }
  };

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

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .single();

      if (error) throw error;
      setAboutContent(data);
    } catch (error) {
      toast.error('Hakkımızda içeriği yüklenirken hata oluştu');
      console.error(error);
    }
  };

  const fetchHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .single();

      if (error) throw error;
      setHeroContent(data);
    } catch (error) {
      toast.error('Hero içeriği yüklenirken hata oluştu');
      console.error(error);
    }
  };

  const calculateStats = (items: GalleryItem[]) => {
    const categoriesCount: { [key: string]: number } = {};
    items.forEach(item => {
      categoriesCount[item.category] = (categoriesCount[item.category] || 0) + 1;
    });

    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentUploads = items.filter(item => 
      new Date(item.created_at) > lastWeek
    ).length;

    setStats({
      totalImages: items.length,
      categoriesCount,
      recentUploads
    });
  };

  const handleGalleryUpload = async (e: React.FormEvent) => {
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
      toast.error('Yükleme sırasında bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      
      if (blogImage) {
        const fileName = `${Date.now()}-${blogImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from('blog')
          .upload(fileName, blogImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('blog')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: blogTitle,
          content: blogContent,
          category: blogCategory,
          image_url: imageUrl
        });

      if (error) throw error;

      toast.success('Blog yazısı başarıyla eklendi');
      setBlogTitle('');
      setBlogContent('');
      setBlogCategory('');
      setBlogImage(null);
      fetchBlogPosts();
    } catch (error) {
      toast.error('Blog yazısı eklenirken bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAboutUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutContent) return;

    try {
      const { error } = await supabase
        .from('about_content')
        .update({
          content: aboutContent.content,
          image_url: aboutContent.image_url
        })
        .eq('id', aboutContent.id);

      if (error) throw error;
      toast.success('Hakkımızda içeriği güncellendi');
    } catch (error) {
      toast.error('Güncelleme sırasında bir hata oluştu');
      console.error(error);
    }
  };

  const handleHeroUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroContent) return;

    try {
      const { error } = await supabase
        .from('hero_content')
        .update({
          title: heroContent.title,
          description: heroContent.description,
          background_image: heroContent.background_image
        })
        .eq('id', heroContent.id);

      if (error) throw error;
      toast.success('Hero içeriği güncellendi');
    } catch (error) {
      toast.error('Güncelleme sırasında bir hata oluştu');
      console.error(error);
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

  const chartData = Object.entries(stats.categoriesCount).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h2 className="text-2xl font-bold text-green-600">Admin Panel</h2>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === 'gallery' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('gallery')}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Galeri
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === 'blog' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('blog')}
                >
                  <PenTool className="mr-2 h-4 w-4" />
                  Blog
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === 'about' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('about')}
                >
                  <Info className="mr-2 h-4 w-4" />
                  Hakkımızda
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === 'hero' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('hero')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Hero
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === 'settings' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Ayarlar
                </Button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">{user.email}</span>
            </div>
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Toplam Görsel</CardTitle>
                  <CardDescription>Galerideki toplam görsel sayısı</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalImages}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kategoriler</CardTitle>
                  <CardDescription>Toplam kategori sayısı</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{Object.keys(stats.categoriesCount).length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Son 7 Gün</CardTitle>
                  <CardDescription>Son bir haftada eklenen görseller</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.recentUploads}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Kategori Dağılımı</CardTitle>
                <CardDescription>Kategorilere göre görsel dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gallery */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Yeni Görsel Ekle</CardTitle>
                <CardDescription>Galeriye yeni görsel ekleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGalleryUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Resimler</label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setImages(Array.from(e.target.files || []))}
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
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Yükleniyor...' : 'Ekle'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Galeri Yönetimi</CardTitle>
                <CardDescription>Mevcut görselleri yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {item.category}
                          </span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id, item.image_url)}
                          >
                            Sil
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Blog */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Yazısı Ekle</CardTitle>
                <CardDescription>Yeni blog yazısı oluşturun</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Başlık</label>
                    <Input
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="Blog yazısı başlığı"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Kategori</label>
                    <Select value={blogCategory} onValueChange={setBlogCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="peyzaj">Peyzaj</SelectItem>
                        <SelectItem value="bitkiler">Bitkiler</SelectItem>
                        <SelectItem value="tasarim">Tasarım</SelectItem>
                        <SelectItem value="uretim">Üretim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">İçerik</label>
                    <Textarea
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder="Blog yazısı içeriği"
                      rows={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Görsel</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBlogImage(e.target.files?.[0] || null)}
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Yükleniyor...' : 'Yazıyı Yayınla'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blog Yazıları</CardTitle>
                <CardDescription>Mevcut blog yazılarını yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="bg-white p-4 rounded-lg shadow">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{post.title}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {post.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{post.content.substring(0, 150)}...</p>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">Düzenle</Button>
                        <Button variant="destructive" size="sm">Sil</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* About */}
        {activeTab === 'about' && aboutContent && (
          <Card>
            <CardHeader>
              <CardTitle>Hakkımızda</CardTitle>
              <CardDescription>Hakkımızda bölümünü düzenleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAboutUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">İçerik</label>
                  <Textarea
                    value={aboutContent.content}
                    onChange={(e) => setAboutContent({ ...aboutContent, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Görsel URL</label>
                  <Input
                    value={aboutContent.image_url || ''}
                    onChange={(e) => setAboutContent({ ...aboutContent, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <Button type="submit">Güncelle</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Hero */}
        {activeTab === 'hero' && heroContent && (
          <Card>
            <CardHeader>
              <CardTitle>Hero Bölümü</CardTitle>
              <CardDescription>Ana sayfa hero bölümünü düzenleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHeroUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Başlık</label>
                  <Input
                    value={heroContent.title}
                    onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Açıklama</label>
                  <Textarea
                    value={heroContent.description}
                    onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Arka Plan Görseli URL</label>
                  <Input
                    value={heroContent.background_image}
                    onChange={(e) => setHeroContent({ ...heroContent, background_image: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit">Güncelle</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>Ayarlar</CardTitle>
              <CardDescription>Sistem ayarlarını yapılandırın</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Hesap Bilgileri</h3>
                  <p className="text-sm text-gray-600">E-posta: {user.email}</p>
                  <p className="text-sm text-gray-600">Son giriş: {new Date(user.last_sign_in_at || '').toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Sistem Bilgileri</h3>
                  <p className="text-sm text-gray-600">Toplam depolama alanı: Sınırsız</p>
                  <p className="text-sm text-gray-600">Maksimum dosya boyutu: 50MB</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Yedekleme</h3>
                  <p className="text-sm text-gray-600 mb-2">Tüm verileriniz otomatik olarak yedeklenir</p>
                  <Button variant="outline">Manuel Yedekleme</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;