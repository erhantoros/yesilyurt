import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { TreePine } from 'lucide-react';
import { ImageModal } from '@/components/ui/image-modal';
import { supabase } from '@/lib/supabase';

interface ProductItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title?: string;
    description?: string;
  } | null>(null);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('product_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProductItems(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'Tüm Ürünler' },
    { id: 'Ağaçlar', name: 'Ağaçlar' },
    { id: 'Çiçekler', name: 'Çiçekler' },
    { id: 'Çim', name: 'Çim' },
    { id: 'Fidanlar', name: 'Fidanlar' }
  ];

  const filteredItems = activeCategory === 'all' 
    ? productItems 
    : productItems.filter(item => item.category === activeCategory);

  return (
    <Layout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Ürünlerimiz</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Kendi üretim alanlarımızda özenle yetiştirdiğimiz bitkiler ve peyzaj ürünlerimiz
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2 rounded-full transition-all ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>

          {filteredItems.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div 
                    className="relative h-64 cursor-pointer"
                    onClick={() => setSelectedImage({
                      url: item.image_url,
                      title: item.title,
                      description: item.description
                    })}
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        {item.category || 'Kategorisiz'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.title || 'İsimsiz Ürün'}</h3>
                    {item.description && (
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedImage({
                          url: item.image_url,
                          title: item.title,
                          description: item.description
                        })}
                        className="text-green-600 hover:text-green-700 transition-colors"
                      >
                        Detayları Gör
                      </button>
                      <a
                        href={`https://wa.me/905416459107?text=Merhaba, ${encodeURIComponent(item.title || 'Ürün')} hakkında bilgi almak istiyorum.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <TreePine className="h-5 w-5" />
                        <span>Bilgi Al</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TreePine className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <p className="text-gray-600">
                Henüz ürün eklenmemiş.
              </p>
            </div>
          )}
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ''}
        title={selectedImage?.title}
        description={selectedImage?.description}
      />
    </Layout>
  );
}