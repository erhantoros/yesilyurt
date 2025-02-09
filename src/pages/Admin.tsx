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
import { LogoSettings } from '@/components/ui/logo-settings';
import { AboutSettings } from '@/components/ui/about-settings';
import { 
  BarChart3, 
  Image as ImageIcon, 
  Home, 
  Settings, 
  Users, 
  LogOut,
  Info,
  TreePine,
  Package,
  FileText,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  image_url: string;
  created_at: string;
}

interface ProductItem {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  image_url: string;
  created_at: string;
}

interface CatalogPage {
  id: string;
  page_number: number;
  image_url: string;
}

interface ContactInfo {
  id: string;
  phone: string;
  email: string;
  address: string;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [catalogPages, setCatalogPages] = useState<CatalogPage[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  const categories = {
    gallery: [
      "Uygulama",
      "Üretim",
      "Çizim",
      "Tasarım"
    ],
    products: [
      "Ağaçlar",
      "Çiçekler",
      "Çim",
      "Fidanlar"
    ]
  };

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
      fetchProductItems();
      fetchCatalogPages();
      fetchContactInfo();
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
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Galeri öğeleri yüklenirken hata oluştu');
    }
  };

  const fetchProductItems = async () => {
    try {
      const { data, error } = await supabase
        .from('product_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProductItems(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Ürün öğeleri yüklenirken hata oluştu');
    }
  };

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

  const handleImageUpload = async (file: File, bucket: string) => {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleGalleryUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const files = formData.getAll('images') as File[];
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as string;

      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
          continue;
        }

        if (!file.type.startsWith('image/')) {
          toast.error('Sadece resim dosyaları yüklenebilir');
          continue;
        }

        const imageUrl = await handleImageUpload(file, 'gallery');

        const { error: dbError } = await supabase
          .from('gallery_items')
          .insert({
            title: title || undefined,
            description: description || undefined,
            category: category || undefined,
            image_url: imageUrl
          });

        if (dbError) throw dbError;
      }

      toast.success('Galeri öğeleri başarıyla eklendi');
      form.reset();
      fetchGalleryItems();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Yükleme sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const files = formData.getAll('images') as File[];
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as string;

      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
          continue;
        }

        if (!file.type.startsWith('image/')) {
          toast.error('Sadece resim dosyaları yüklenebilir');
          continue;
        }

        const imageUrl = await handleImageUpload(file, 'products');

        const { error: dbError } = await supabase
          .from('product_items')
          .insert({
            title: title || undefined,
            description: description || undefined,
            category: category || undefined,
            image_url: imageUrl
          });

        if (dbError) throw dbError;
      }

      toast.success('Ürün öğeleri başarıyla eklendi');
      form.reset();
      fetchProductItems();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Yükleme sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCatalogUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const files = formData.getAll('pages') as File[];

      for (const [index, file] of files.entries()) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
          continue;
        }

        if (!file.type.startsWith('image/')) {
          toast.error('Sadece resim dosyaları yüklenebilir');
          continue;
        }

        const imageUrl = await handleImageUpload(file, 'catalog');

        const { error: dbError } = await supabase
          .from('catalog_pages')
          .insert({
            page_number: index + 1,
            image_url: imageUrl
          });

        if (dbError) throw dbError;
      }

      toast.success('Katalog sayfaları başarıyla eklendi');
      form.reset();
      fetchCatalogPages();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Yükleme sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleContactUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactInfo) return;
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const phone = formData.get('phone') as string;
      const email = formData.get('email') as string;
      const address = formData.get('address') as string;

      const { error } = await supabase
        .from('contact_info')
        .update({
          phone,
          email,
          address
        })
        .eq('id', contactInfo.id);

      if (error) throw error;

      toast.success('İletişim bilgileri güncellendi');
      fetchContactInfo();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Güncelleme sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string, table: string) => {
    try {
      const fileName = imageUrl.split('/').pop();
      
      if (fileName) {
        const bucket = table === 'gallery_items' ? 'gallery' : 
                      table === 'product_items' ? 'products' : 'catalog';
        
        const { error: storageError } = await supabase.storage
          .from(bucket)
          .remove([fileName]);

        if (storageError) {
          console.error('Storage delete error:', storageError);
          toast.error('Dosya silinirken hata oluştu');
          return;
        }
      }

      const { error: dbError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error('Database delete error:', dbError);
        toast.error('Kayıt silinirken hata oluştu');
        return;
      }

      toast.success('Öğe başarıyla silindi');
      
      if (table === 'gallery_items') fetchGalleryItems();
      else if (table === 'product_items') fetchProductItems();
      else if (table === 'catalog_pages') fetchCatalogPages();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Silme işlemi başarısız oldu');
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
                  variant={activeTab === 'products' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('products')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Ürünler
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === 'catalog' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('catalog')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Katalog
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === 'contact' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('contact')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  İletişim
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
        {/* Gallery Management */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Galeri Yönetimi</CardTitle>
                <CardDescription>Galeri öğelerini ekleyin ve yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGalleryUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Resimler</label>
                    <Input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Başlık</label>
                    <Input
                      name="title"
                      placeholder="Başlık (opsiyonel)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Açıklama</label>
                    <Textarea
                      name="description"
                      placeholder="Açıklama (opsiyonel)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Kategori</label>
                    <Select name="category">
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin (opsiyonel)" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.gallery.map((cat) => (
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

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold">{item.title || 'Başlıksız'}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description || 'Açıklama yok'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {item.category || 'Kategorisiz'}
                          </span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id, item.image_url, 'gallery_items')}
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

        {/* Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ürün Yönetimi</CardTitle>
                <CardDescription>Ürün öğelerini ekleyin ve yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Resimler</label>
                    <Input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Başlık</label>
                    <Input
                      name="title"
                      placeholder="Başlık (opsiyonel)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Açıklama</label>
                    <Textarea
                      name="description"
                      placeholder="Açıklama (opsiyonel)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Kategori</label>
                    <Select name="category">
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin (opsiyonel)" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.products.map((cat) => (
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

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {productItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold">{item.title || 'Başlıksız'}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description || 'Açıklama yok'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {item.category || 'Kategorisiz'}
                          </span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id, item.image_url, 'product_items')}
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

        {/* Catalog Management */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Katalog Yönetimi</CardTitle>
                <CardDescription>Katalog sayfalarını ekleyin ve yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCatalogUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Katalog Sayfaları</label>
                    <Input
                      type="file"
                      name="pages"
                      accept="image/*"
                      multiple
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Sayfaları sırasıyla seçin. İlk seçilen resim ilk sayfa olacaktır.
                    </p>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Yükleniyor...' : 'Ekle'}
                  </Button>
                </form>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {catalogPages.map((page) => (
                    <div key={page.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <img
                        src={page.image_url}
                        alt={`Sayfa ${page.page_number}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold">Sayfa {page.page_number}</h3>
                        <div className="flex items-center justify-end mt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(page.id, page.image_url, 'catalog_pages')}
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

        {/* Contact Management */}
        {activeTab === 'contact' && contactInfo && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
                <CardDescription>İletişim bilgilerini güncelleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefon</label>
                    <Input
                      name="phone"
                      defaultValue={contactInfo.phone}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">E-posta</label>
                    <Input
                      name="email"
                      type="email"
                      defaultValue={contactInfo.email}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Adres</label>
                    <Textarea
                      name="address"
                      defaultValue={contactInfo.address}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <LogoSettings />
            <AboutSettings />
            <Card>
              <CardHeader>
                <CardTitle>Hesap Ayarları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Hesap Bilgileri</h3>
                    <p className="text-sm text-gray-600">E-posta: {user.email}</p>
                    <p className="text-sm text-gray-600">
                      Son giriş: {new Date(user.last_sign_in_at || '').toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Sistem Bilgileri</h3>
                    <p className="text-sm text-gray-600">Toplam depolama alanı: Sınırsız</p>
                    <p className="text-sm text-gray-600">Maksimum dosya boyutu: 5MB</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Yedekleme</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Tüm verileriniz otomatik olarak yedeklenir
                    </p>
                    <Button variant="outline">Manuel Yedekleme</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}