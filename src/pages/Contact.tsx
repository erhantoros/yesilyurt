import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { useContact } from '@/hooks/use-contact';

export default function Contact() {
  const { contactInfo } = useContact();

  const handleContactSubmit = (e: React.FormEvent) => {
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

  if (!contactInfo) return null;

  return (
    <Layout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-bold mb-6">İletişim</h1>
              <p className="text-gray-600 mb-8">
                Projeleriniz için bizimle iletişime geçin. Size en uygun çözümü sunalım.
              </p>
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
              <div className="flex space-x-4 mt-8">
                <a
                  href={`https://wa.me/${contactInfo.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  <FaWhatsapp size={24} />
                </a>
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

              {/* Google Maps */}
              <div className="mt-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.448871212394!2d31.049487576298834!3d36.86931676379962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c483e7b1324401%3A0xef76e2e9ddaf1dd1!2sYesilyurt%20peyzaj%20ltd%20sti!5e1!3m2!1str!2str!4v1738919530440!5m2!1str!2str"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '0.5rem' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="shadow-lg"
                ></iframe>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
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
      </div>
    </Layout>
  );
}