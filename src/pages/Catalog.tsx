import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { TreePine, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { useCatalog } from '@/hooks/use-catalog';

export default function Catalog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { catalogPages } = useCatalog();
  const totalPages = catalogPages.length;

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (isFullscreen) {
      if (e.key === 'ArrowRight') goToNextPage();
      if (e.key === 'ArrowLeft') goToPreviousPage();
      if (e.key === 'Escape') setIsFullscreen(false);
    }
  };

  // Klavye olaylarını dinle
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, currentPage]);

  return (
    <Layout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Ürün Kataloğumuz</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Tüm ürünlerimizi detaylı bir şekilde inceleyebilirsiniz
            </p>
          </motion.div>

          {catalogPages.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Katalog Görüntüleyici */}
                <div className="w-full h-[calc(100vh-300px)] md:h-[calc(100vh-200px)] relative">
                  <img
                    src={catalogPages[currentPage - 1]?.image_url}
                    alt={`Katalog sayfa ${currentPage}`}
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '100%', width: 'auto', margin: '0 auto' }}
                  />
                  
                  {/* Tam Ekran Butonu */}
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Maximize2 className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Navigasyon Kontrolleri */}
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-4">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 bg-black/50 text-white rounded-full disabled:opacity-50 hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  
                  <span className="bg-black/50 text-white px-4 py-2 rounded-full">
                    {currentPage} / {totalPages}
                  </span>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-black/50 text-white rounded-full disabled:opacity-50 hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TreePine className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <p className="text-gray-600">
                Katalog yakında eklenecektir.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tam Ekran Görüntüleyici */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Kapatma Butonu */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Önceki Sayfa Butonu */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          {/* Sayfa Görüntüleyici */}
          <img
            src={catalogPages[currentPage - 1]?.image_url}
            alt={`Katalog sayfa ${currentPage}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />

          {/* Sonraki Sayfa Butonu */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Sayfa Numarası */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
            {currentPage} / {totalPages}
          </div>
        </div>
      )}
    </Layout>
  );
}