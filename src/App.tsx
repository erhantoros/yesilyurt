import { useState, useEffect } from "react";
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaBars, FaStar } from "react-icons/fa";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { TreePine, Shovel, Sprout, Camera } from "lucide-react";
import { supabase } from '@/lib/supabase';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
}

interface HeroContent {
  title: string;
  description: string;
  background_image: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ElementType;
  animate?: boolean;
}

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "whileHover" | "whileTap"> {
  children: React.ReactNode;
  className?: string;
}

const services = [
  {
    icon: TreePine,
    title: "Peyzaj Tasarımı",
    description: "Modern ve sürdürülebilir peyzaj tasarımları",
    details: ["3D Modelleme", "Konsept Tasarım", "Detaylı Planlama"]
  },
  {
    icon: Sprout,
    title: "Bitki Seçimi",
    description: "İklime uygun bitki seçimi ve yerleştirme",
    details: ["İklim Analizi", "Mevsimsel Planlama", "Sürdürülebilir Seçimler"]
  },
  {
    icon: Shovel,
    title: "Uygulama",
    description: "Profesyonel ekiple kusursuz uygulama",
    details: ["Uzman Ekip", "Kaliteli Malzeme", "Zamanında Teslimat"]
  }
];

const testimonials = [
  {
    name: "Ayşe Yılmaz",
    role: "Villa Sahibi",
    comment: "Harika bir iş çıkardılar. Bahçemiz artık bir cennet gibi!",
    rating: 5
  },
  {
    name: "Mehmet Demir",
    role: "Site Yöneticisi",
    comment: "Profesyonel ekip, mükemmel sonuç. Kesinlikle tavsiye ediyorum.",
    rating: 5
  },
  {
    name: "Zeynep Kaya",
    role: "Restoran Sahibi",
    comment: "Müşterilerimiz yeni bahçemize bayıldı. Teşekkürler!",
    rating: 5
  }
];

const Card = ({ children, className = "", icon: Icon, animate = true }: CardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      variants={animate ? cardVariants : undefined}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }} 
      className={`shadow-lg border rounded-xl p-6 bg-white/90 backdrop-blur-sm ${className}`}
    >
      {Icon && <Icon className="w-12 h-12 mb-4 text-green-600" />}
      {children}
    </motion.div>
  );
};

const Button = ({ children, className = "", ...props }: ButtonProps) => (
  <motion.button 
    whileHover={{ scale: 1.05 }} 
    whileTap={{ scale: 0.95 }} 
    className={`px-6 py-3 rounded-full font-semibold shadow-lg transition-colors ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "Hayalinizdeki Bahçeyi Birlikte Tasarlayalım",
    description: "20 yıllık deneyimimizle, modern peyzaj çözümleri sunuyoruz.",
    background_image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae"
  });
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data: heroData } = await supabase
      .from('hero_content')
      .select('*')
      .single();

    if (heroData) {
      setHeroContent(heroData);
    }

    const { data: galleryData } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (galleryData) {
      setGalleryItems(galleryData);
      const uniqueCategories = [...new Set(galleryData.map(item => item.category))];
      setCategories(uniqueCategories);
    }
  };

  const filteredGalleryItems = activeCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center px-4 py-2">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center"
          >
            <img 
              src="/logo.png" 
              alt="Yeşilyurt Peyzaj Logo" 
              className="h-32 w-auto mr-2"
            />
          </motion.div>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-green-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars size={24} />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {["Hizmetler", "Projeler", "Yorumlar", "Blog", "İletişim"].map((item) => (
                <motion.li 
                  key={item}
                  whileHover={{ scale: 1.1 }}
                >
                  <a 
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="flex space-x-4">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href="https://wa.me/905416459107" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
              >
                <FaWhatsapp className="mr-2" /> WhatsApp
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href="https://www.instagram.com/yesilyurt__peyzaj/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
              >
                <FaInstagram className="mr-2" /> Instagram
              </motion.a>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg lg:hidden"
              >
                <nav className="container mx-auto py-4 px-4">
                  <ul className="space-y-4">
                    {["Hizmetler", "Projeler", "Yorumlar", "Blog", "İletişim"].map((item) => (
                      <motion.li 
                        key={item}
                        whileHover={{ x: 10 }}
                      >
                        <a 
                          href={`#${item.toLowerCase()}`}
                          className="block text-gray-600 hover:text-green-600 transition-colors font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="flex flex-col space-y-4 mt-4">
                    <a 
                      href="https://wa.me/905416459107" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                    >
                      <FaWhatsapp className="mr-2" /> WhatsApp
                    </a>
                    <a 
                      href="https://www.instagram.com/yesilyurt__peyzaj/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
                    >
                      <FaInstagram className="mr-2" /> Instagram
                    </a>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="w-full pt-24 min-h-screen flex items-center relative bg-cover bg-center bg-fixed bg-no-repeat"
        style={{
          backgroundImage: `url('${heroContent.background_image}')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-4 relative z-10 text-white"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-3xl">
            {heroContent.title}
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-200">
            {heroContent.description}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="https://wa.me/905416459107"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700">
                <FaWhatsapp className="inline-block mr-2" /> Ücretsiz Keşif
              </Button>
            </a>
            <a href="#projeler">
              <Button className="w-full sm:w-auto bg-white text-green-600 hover:bg-gray-100">
                <Camera className="inline-block mr-2" /> Projelerimiz
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="hizmetler" className="py-20 bg-white w-full">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Hizmetlerimiz</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profesyonel ekibimizle, bahçenizin her detayını özenle planlıyor ve uyguluyoruz.
            </p>
          </motion.div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <Card key={index} icon={service.icon}>
                <h4 className="text-xl font-semibold mb-3">{service.title}</h4>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projeler" className="py-20 bg-gray-50 w-full">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Galeri</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Bitki koleksiyonumuzdan örnekler ve tamamladığımız projeler
            </p>
            
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button
                className={`${
                  activeCategory === "all"
                    ? "bg-green-600 text-white"
                    : "bg-white text-green-600"
                }`}
                onClick={() => setActiveCategory("all")}
              >
                Tümü
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  className={`${
                    activeCategory === category
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-600"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {filteredGalleryItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-xl shadow-lg aspect-square"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="text-sm bg-green-600 px-3 py-1 rounded-full">{item.category}</span>
                    <h4 className="text-xl font-bold mt-2">{item.title}</h4>
                    <p className="text-gray-200">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="yorumlar" className="py-20 bg-white w-full">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Müşteri Yorumları</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mutlu müşterilerimizin deneyimleri
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 w-5 h-5" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <div className="mt-auto">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gray-50 w-full">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Blog</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Peyzaj ve bahçe bakımı hakkında faydalı bilgiler
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Bahçe Bakımı İpuçları",
                description: "Bahçenizi her mevsim canlı tutmanın yolları",
                image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b"
              },
              {
                title: "Doğru Bitki Seçimi",
                description: "İkliminize uygun bitkileri nasıl seçersiniz?",
                image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735"
              },
              {
                title: "Modern Peyzaj Trendleri",
                description: "2024'ün en popüler peyzaj tasarım trendleri",
                image: "https://images.unsplash.com/photo-1598902108854-10e335adac99"
              }
            ].map((post, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-semibold mb-2">{post.title}</h4>
                <p className="text-gray-600">{post.description}</p>
                <Button className="mt-4 bg-green-600 text-white hover:bg-green-700">
                  Devamını Oku
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="iletisim" className="py-20 bg-white w-full">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-6">İletişime Geçin</h3>
              <p className="text-gray-600 mb-8">
                Projeleriniz için ücretsiz keşif randevusu alın. Size en kısa sürede dönüş yapalım.
              </p>
              <div className="space-y-6">
                <a 
                  href="https://wa.me/905416459107"
                  className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                >
                  <FaWhatsapp className="mr-3 w-6 h-6" />
                  <span>+90 541 645 91 07</span>
                </a>
                <a 
                  href="https://www.google.com/maps?q=Yeşilyurt+Peyzaj"
                  className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                >
                  <FaMapMarkerAlt className="mr-3 w-6 h-6" />
                  <span>Eminceler, Serik / Antalya</span>
                </a>
                <div className="pt-6">
                  <h4 className="text-xl font-semibold mb-4">Çalışma Saatleri</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>Pazartesi - Cumartesi: 08:00 - 18:00</p>
                    <p>Pazar: Kapalı</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Mesajınız alındı! En kısa sürede size dönüş yapacağız.");
              }}
            >
              <div>
                <input
                  type="text"
                  placeholder="Adınız Soyadınız"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="E-posta Adresiniz"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Telefon Numaranız"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                  required
                >
                  <option value="">Hizmet Seçin</option>
                  <option value="peyzaj">Peyzaj Tasarımı</option>
                  <option value="bakim">Bahçe Bakımı</option>
                  <option value="sulama">Sulama Sistemleri</option>
                  <option value="bitki">Bitki Satışı</option>
                </select>
              </div>
              <div>
                <textarea
                  placeholder="Mesajınız"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                  required
                ></textarea>
              </div>
              <Button className="w-full bg-green-600 text-white hover:bg-green-700" type="submit">
                Gönder
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Yeşilyurt Peyzaj Logo" 
                  className="h-16 w-auto mr-2"
                />
                YEŞİLYURT PEYZAJ
              </h4>
              <p className="text-gray-400">
                20 yıldır profesyonel peyzaj hizmetleri sunuyoruz.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Hizmetler</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Peyzaj Tasarımı</li>
                <li>Bahçe Bakımı</li>
                <li>Sulama Sistemleri</li>
                <li>Bitki Satışı</li>
                <li>Mobilya</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Hızlı Bağlantılar</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#hizmetler" className="hover:text-white transition-colors">Hizmetler</a></li>
                <li><a href="#projeler" className="hover:text-white transition-colors">Projeler</a></li>
                <li><a href="#yorumlar" className="hover:text-white transition-colors">Yorumlar</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#iletisim" className="hover:text-white transition-colors">İletişim</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">İletişim</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Eminceler, Serik / Antalya</li>
                <li>+90 541 645 91 07</li>
                <li>info@yesilyurtpeyzaj.com</li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a 
                  href="https://wa.me/905416459107"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-400 transition-colors"
                >
                  <FaWhatsapp size={24} />
                </a>
                <a 
                  href="https://www.instagram.com/yesilyurt__peyzaj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-pink-400 transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 YEŞİLYURT PEYZAJ. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;