import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Shovel, Sprout, Camera, TreePine } from 'lucide-react';
import { useContent } from '@/hooks/use-content';
import { useGallery } from '@/hooks/use-gallery';
import { useContact } from '@/hooks/use-contact';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { ImageModal } from '@/components/ui/image-modal';

export default function Home() {
  const { heroContent, aboutContent } = useContent();
  const { galleryItems } = useGallery();
  const { contactInfo } = useContact();
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title?: string;
    description?: string;
  } | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    if (!data.name || !data.email || !data.message) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    // WhatsApp mesaj formatı
    const message = `*Yeni İletişim Formu*%0A%0A*İsim:* ${data.name}%0A*E-posta:* ${data.email}%0A*Mesaj:* ${data.message}`;
    
    // WhatsApp linkini oluştur
    const whatsappUrl = `https://wa.me/${contactInfo?.phone.replace(/\D/g, '')}?text=${message}`;
    
    // Yeni sekmede WhatsApp'ı aç
    window.open(whatsappUrl, '_blank');
    
    toast.success('WhatsApp üzerinden iletişime geçiliyor...');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        {heroContent && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroContent.background_image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>
            <div className="relative container mx-auto px-4 text-center text-white">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                {heroContent.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl mb-8"
              >
                {heroContent.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col md:flex-row justify-center gap-4"
              >
                <Link to="/contact" className="btn-primary">
                  İletişime Geçin
                </Link>
                <Link to="/catalog" className="btn-secondary">
                  Katalog
                </Link>
              </motion.div>
            </div>
          </>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="py-20 section-light">
        <div className="container mx-auto px-4">
          {aboutContent && (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Hakkımızda</h2>
                <p className="text-gray-600 mb-6">{aboutContent.content}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <TreePine className="text-green-600 h-5 w-5" />
                    <span>20+ Yıl Deneyim</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TreePine className="text-green-600 h-5 w-5" />
                    <span>500+ Proje</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TreePine className="text-green-600 h-5 w-5" />
                    <span>30+ Uzman</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TreePine className="text-green-600 h-5 w-5" />
                    <span>%98 Memnuniyet</span>
                  </div>
                </div>
              </motion.div>
              {aboutContent.image_url && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={aboutContent.image_url}
                    alt="Yeşilyurt Peyzaj Hakkında"
                    className="rounded-lg shadow-lg w-full h-[400px] object-cover"
                  />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 section-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Hizmetlerimiz</h2>
            <p className="text-gray-600">Size özel profesyonel peyzaj çözümleri sunuyoruz</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-hover p-6 rounded-lg"
            >
              <div className="text-green-600 mb-4">
                <Shovel className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Peyzaj Uygulama</h3>
              <p className="text-gray-600">
                Profesyonel ekibimizle hayalinizdeki bahçeyi gerçeğe dönüştürüyoruz.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card-hover p-6 rounded-lg"
            >
              <div className="text-green-600 mb-4">
                <Sprout className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bitki Üretimi</h3>
              <p className="text-gray-600">
                Kendi üretim alanlarımızda yetiştirdiğimiz bitkilerle projenizi şekillendiriyoruz.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="card-hover p-6 rounded-lg"
            >
              <div className="text-green-600 mb-4">
                <Camera className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3D Tasarım</h3>
              <p className="text-gray-600">
                Modern teknolojilerle projenizi önceden görselleştiriyoruz.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 section-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Galeri</h2>
            <p className="text-gray-600">Tamamladığımız projelerden örnekler</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {galleryItems.slice(0, 6).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                onClick={() => setSelectedImage({
                  url: item.image_url,
                  title: item.title,
                  description: item.description
                })}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/gallery" className="btn-primary">
              Tüm Galeriyi Görüntüle
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 section-light">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">İletişim</h2>
              <p className="text-gray-600 mb-8">
                Projeleriniz için bizimle iletişime geçin. Size en uygun çözümü sunalım.
              </p>
              {contactInfo && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <FaMapMarkerAlt className="text-green-600 h-5 w-5" />
                    <span>{contactInfo.address}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FaPhone className="text-green-600 h-5 w-5" />
                    <span>{contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FaEnvelope className="text-green-600 h-5 w-5" />
                    <span>{contactInfo.email}</span>
                  </div>
                </div>
              )}
              <div className="flex space-x-4 mt-8">
                {contactInfo && (
                  <a
                    href={`https://wa.me/${contactInfo.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    <FaWhatsapp size={24} />
                  </a>
                )}
                <a
                  href="https://www.instagram.com/yesilyurt__peyzaj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://www.facebook.com/yesilyurtpeyzaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <FaFacebook size={24} />
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-6">Bize Mesaj Gönderin</h3>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="input-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mesaj
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="input-primary"
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
                  >
                    <FaWhatsapp size={20} />
                    <span>WhatsApp'tan Gönder</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
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