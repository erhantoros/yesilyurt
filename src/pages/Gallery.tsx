import { motion } from 'framer-motion';
import { useState } from 'react';
import { useGallery } from '@/hooks/use-gallery';
import Layout from '@/components/Layout';
import { ImageModal } from '@/components/ui/image-modal';

export default function Gallery() {
  const { galleryItems } = useGallery();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title?: string;
    description?: string;
  } | null>(null);

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'Uygulama', name: 'Uygulama' },
    { id: 'Üretim', name: 'Üretim' },
    { id: 'Çizim', name: 'Çizim' },
    { id: 'Tasarım', name: 'Tasarım' }
  ];

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <Layout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Galeri</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Tamamladığımız projelerden örnekler. Her bir proje, müşterilerimizin hayallerini gerçeğe dönüştürdüğümüz özel çalışmalardır.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
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

          <div className="grid md:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-lg shadow-lg overflow-hidden"
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
                  {item.category && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{item.title || 'Başlıksız'}</h3>
                  {item.description && (
                    <p className="text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.description && item.description.length > 100 && (
                    <button
                      onClick={() => setSelectedImage({
                        url: item.image_url,
                        title: item.title,
                        description: item.description
                      })}
                      className="text-green-600 hover:text-green-700 mt-2 text-sm"
                    >
                      Devamını Oku
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
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