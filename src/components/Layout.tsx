import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaFacebook, FaBars } from 'react-icons/fa';
import { TreePine } from 'lucide-react';
import { useContact } from '@/hooks/use-contact';
import { useLogo } from '@/hooks/use-logo';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { contactInfo } = useContact();
  const { logoSettings } = useLogo();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 header-glass">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24 md:h-32">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src={logoSettings?.header_logo || '/logo.png'} 
                alt="Yeşilyurt Peyzaj Logo" 
                className="h-20 md:h-28 w-auto transition-all duration-300"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`relative px-3 py-2 text-lg font-medium transition-all duration-300 hover:text-green-600 group ${
                  isActive('/') ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                <span>Ana Sayfa</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform origin-left transition-transform duration-300 ${
                  isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
              <Link
                to="/about"
                className={`relative px-3 py-2 text-lg font-medium transition-all duration-300 hover:text-green-600 group ${
                  isActive('/about') ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                <span>Hakkımızda</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform origin-left transition-transform duration-300 ${
                  isActive('/about') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
              <Link
                to="/services"
                className={`relative px-3 py-2 text-lg font-medium transition-all duration-300 hover:text-green-600 group ${
                  isActive('/services') ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                <span>Hizmetler</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform origin-left transition-transform duration-300 ${
                  isActive('/services') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
              <Link
                to="/gallery"
                className={`relative px-3 py-2 text-lg font-medium transition-all duration-300 hover:text-green-600 group ${
                  isActive('/gallery') ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                <span>Galeri</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform origin-left transition-transform duration-300 ${
                  isActive('/gallery') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
              <Link
                to="/products"
                className={`relative px-3 py-2 text-lg font-medium transition-all duration-300 hover:text-green-600 group ${
                  isActive('/products') ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                <span>Ürünlerimiz</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform origin-left transition-transform duration-300 ${
                  isActive('/products') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
              <Link
                to="/catalog"
                className={`relative px-3 py-2 text-lg font-medium transition-all duration-300 hover:text-green-600 group ${
                  isActive('/catalog') ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                <span>Katalog</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform origin-left transition-transform duration-300 ${
                  isActive('/catalog') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
              <Link
                to="/contact"
                className={`relative px-3 py-2 text-lg font-medium transition-all duration-300 hover:text-green-600 group ${
                  isActive('/contact') ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                <span>İletişim</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform origin-left transition-transform duration-300 ${
                  isActive('/contact') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
              
              {/* Social Media Links */}
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-emerald-200">
                {contactInfo && (
                  <a
                    href={`https://wa.me/${contactInfo.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 transition-all duration-300 transform hover:scale-110"
                    aria-label="WhatsApp"
                  >
                    <div className="bg-green-50 p-2 rounded-full">
                      <FaWhatsapp size={24} />
                    </div>
                  </a>
                )}
                <a
                  href="https://www.instagram.com/yesilyurt__peyzaj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <div className="bg-pink-50 p-2 rounded-full">
                    <FaInstagram size={24} />
                  </div>
                </a>
                <a
                  href="https://www.facebook.com/yesilyurtpeyzaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <div className="bg-blue-50 p-2 rounded-full">
                    <FaFacebook size={24} />
                  </div>
                </a>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <FaBars className="h-6 w-6 text-green-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white md:hidden pt-24"
          >
            <nav className="container mx-auto px-4 py-8 flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-xl font-medium p-3 rounded-lg transition-colors ${
                  isActive('/') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/about"
                className={`text-xl font-medium p-3 rounded-lg transition-colors ${
                  isActive('/about') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              <Link
                to="/services"
                className={`text-xl font-medium p-3 rounded-lg transition-colors ${
                  isActive('/services') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Hizmetler
              </Link>
              <Link
                to="/gallery"
                className={`text-xl font-medium p-3 rounded-lg transition-colors ${
                  isActive('/gallery') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Galeri
              </Link>
              <Link
                to="/products"
                className={`text-xl font-medium p-3 rounded-lg transition-colors ${
                  isActive('/products') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Ürünlerimiz
              </Link>
              <Link
                to="/catalog"
                className={`text-xl font-medium p-3 rounded-lg transition-colors ${
                  isActive('/catalog') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Katalog
              </Link>
              <Link
                to="/contact"
                className={`text-xl font-medium p-3 rounded-lg transition-colors ${
                  isActive('/contact') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                İletişim
              </Link>
              
              {/* Social Media Links for Mobile */}
              <div className="flex justify-center space-x-6 pt-6 border-t border-gray-100">
                {contactInfo && (
                  <a
                    href={`https://wa.me/${contactInfo.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 transition-all duration-300 transform hover:scale-110"
                    aria-label="WhatsApp"
                  >
                    <div className="bg-green-50 p-3 rounded-full">
                      <FaWhatsapp size={28} />
                    </div>
                  </a>
                )}
                <a
                  href="https://www.instagram.com/yesilyurt__peyzaj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <div className="bg-pink-50 p-3 rounded-full">
                    <FaInstagram size={28} />
                  </div>
                </a>
                <a
                  href="https://www.facebook.com/yesilyurtpeyzaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <div className="bg-blue-50 p-3 rounded-full">
                    <FaFacebook size={28} />
                  </div>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative z-10 pt-24 md:pt-32">
        {children}
      </main>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Footer */}
      <footer className="footer-gradient text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={logoSettings?.footer_logo || '/logo.png'}
                  alt="Yeşilyurt Peyzaj Logo"
                  className="h-10 md:h-16 w-auto transition-all duration-300"
                />
                <span className="text-xl md:text-2xl font-bold">Yeşilyurt Peyzaj</span>
              </div>
              <p className="text-gray-100 text-base md:text-lg">
                20 yıllık deneyimimizle modern ve sürdürülebilir peyzaj çözümleri sunuyoruz.
              </p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Hızlı Erişim</h3>
              <ul className="space-y-2 text-base md:text-lg">
                <li><Link to="/" className="hover:text-gray-200 transition-colors">Ana Sayfa</Link></li>
                <li><Link to="/about" className="hover:text-gray-200 transition-colors">Hakkımızda</Link></li>
                <li><Link to="/services" className="hover:text-gray-200 transition-colors">Hizmetler</Link></li>
                <li><Link to="/gallery" className="hover:text-gray-200 transition-colors">Galeri</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Hizmetler</h3>
              <ul className="space-y-2 text-base md:text-lg text-gray-100">
                <li>Peyzaj Uygulama</li>
                <li>Bitki Üretimi</li>
                <li>3D Tasarım</li>
                <li>Bakım Hizmetleri</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">İletişim</h3>
              {contactInfo && (
                <ul className="space-y-2 text-base md:text-lg text-gray-100">
                  <li>{contactInfo.address}</li>
                  <li>{contactInfo.phone}</li>
                  <li>{contactInfo.email}</li>
                </ul>
              )}
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-base md:text-lg">&copy; 2024 Yeşilyurt Peyzaj. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}