import { useState, useEffect } from "react";
import { FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt, FaBars, FaStar, FaPhone, FaEnvelope } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Shovel, Sprout, Camera, TreePine, Leaf, Sun, Cloud, Droplets } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
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
  content: string;
  image_url?: string;
}

interface HeroContent {
  title: string;
  description: string;
  background_image: string;
}

// Header bileşeni
const Header = ({ isMenuOpen, setIsMenuOpen }: { isMenuOpen: boolean; setIsMenuOpen: (open: boolean) => void }) => (
  <header className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-50">
    <div className="container mx-auto flex justify-between items-center px-4 py-2">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center"
      >
        <img 
          src="/logo.png" 
          alt="Yeşilyurt Peyzaj Logo" 
          className="h-16 md:h-20 w-auto mr-2 opacity-90 filter contrast-75"
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
          {["Hizmetler", "Üretim", "Projeler", "Blog", "Hakkımızda", "İletişim"].map((item) => (
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
            href="https://www.facebook.com/p/Ye%C5%9Filyurt-S%C3%9CS-Bitkileri-Peyzaj-100063236448530/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
          >
            <FaFacebook className="mr-2" /> Facebook
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
    </div>

    {/* Mobile Navigation */}
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden bg-white border-t shadow-lg"
        >
          <nav className="container mx-auto py-4 px-4">
            <ul className="space-y-4">
              {["Hizmetler", "Üretim", "Projeler", "Blog", "Hakkımızda", "İletişim"].map((item) => (
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
                href="https://www.facebook.com/p/Ye%C5%9Filyurt-S%C3%9CS-Bitkileri-Peyzaj-100063236448530/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
              >
                <FaFacebook className="mr-2" /> Facebook
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
  </header>
);

// Services array
const services = [
  {
    icon: TreePine,
    title: "Peyzaj Tasarımı",
    description: "Modern ve sürdürülebilir peyzaj tasarımları",
    details: ["3D Modelleme", "Konsept Tasarım", "Detaylı Planlama"]
  },
  {
    icon: Sprout,
    title: "Üretim",
    description: "Kendi üretim tesislerimizde yetiştirdiğimiz bitkiler",
    details: ["Süs Bitkileri", "Mevsimlik Çiçekler", "Ağaç ve Çalılar"]
  },
  {
    icon: Shovel,
    title: "Uygulama",
    description: "Profesyonel ekiple kusursuz uygulama",
    details: ["Uzman Ekip", "Kaliteli Malzeme", "Zamanında Teslimat"]
  }
];

// Features array
const features = [
  {
    icon: Leaf,
    title: "Sürdürülebilir Tasarım",
    description: "Çevre dostu ve sürdürülebilir peyzaj çözümleri"
  },
  {
    icon: Sun,
    title: "Doğal Aydınlatma",
    description: "Güneş enerjili aydınlatma sistemleri"
  },
  {
    icon: Cloud,
    title: "Akıllı Sulama",
    description: "Otomatik sulama sistemleri"
  },
  {
    icon: Droplets,
    title: "Su Tasarrufu",
    description: "Su tasarruflu peyzaj çözümleri"
  }
];

const App = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    content: "Yeşilyurt Peyzaj olarak 20 yıllık deneyimimizle...",
    image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae"
  });
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "Yeşilyurt Peyzaj",
    description: "Modern ve sürdürülebilir peyzaj çözümleri",
    background_image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae"
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch gallery items
        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });

        if (galleryError) throw galleryError;
        setGalleryItems(galleryData || []);

        // Fetch blog posts
        const { data: blogData, error: blogError } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (blogError) throw blogError;
        setBlogPosts(blogData || []);

        // Fetch about content
        const { data: aboutData, error: aboutError } = await supabase
          .from('about_content')
          .select('*')
          .single();

        if (aboutError) throw aboutError;
        if (aboutData) setAboutContent(aboutData);

        // Fetch hero content
        const { data: heroData, error: heroError } = await supabase
          .from('hero_content')
          .select('*')
          .single();

        if (heroError) throw heroError;
        if (heroData) setHeroContent(heroData);
      } catch (error) {
        toast.error('İçerik yüklenirken bir hata oluştu');
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const service = formData.get('service') as string;
    const message = formData.get('message') as string;

    // WhatsApp mesajı oluştur
    const whatsappMessage = `*Yeni İletişim Formu*%0A%0A*İsim:* ${name}%0A*E-posta:* ${email}%0A*Telefon:* ${phone}%0A*Hizmet:* ${service}%0A*Mesaj:* ${message}`;
    
    // WhatsApp linkini aç
    window.open(`https://wa.me/905416459107?text=${whatsappMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section 
          className="relative min-h-[90vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroContent.background_image})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
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
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <a 
                  href="https://wa.me/905416459107"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                >
                  <FaWhatsapp className="mr-2" /> Ücretsiz Keşif
                </a>
                <a 
                  href="#projeler"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-green-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Camera className="mr-2" /> Projelerimiz
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <feature.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="hizmetler" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Hizmetlerimiz</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Profesyonel ekibimizle, bahçenizin her detayını özenle planlıyor ve uyguluyoruz.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <service.icon className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <FaStar className="w-4 h-4 text-yellow-500 mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="hakkimizda" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold">Hakkımızda</h2>
                <div className="prose prose-lg">
                  <p>{aboutContent.content}</p>
                </div>
                <div className="flex space-x-4">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href="https://wa.me/905416459107"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                  >
                    <FaWhatsapp className="mr-2" /> İletişime Geç
                  </motion.a>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <img
                  src={aboutContent.image_url}
                  alt="Yeşilyurt Peyzaj"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                  <p className="text-green-600 font-bold">20+ Yıl</p>
                  <p className="text-gray-600">Deneyim</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="projeler" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Projelerimiz</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Tamamladığımız projelerden örnekler
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    activeCategory === "all"
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-600"
                  }`}
                  onClick={() => setActiveCategory("all")}
                >
                  Tümü
                </motion.button>
                {["Uygulama", "Üretim", "Çizim", "Tasarım"].map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                      activeCategory === category
                        ? "bg-green-600 text-white"
                        : "bg-white text-green-600"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryItems
                .filter(item => activeCategory === "all" || item.category === activeCategory)
                .map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    whileHover={{ y: -10 }}
                    className="group relative overflow-hidden rounded-lg shadow-lg aspect-square"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <span className="text-sm bg-green-600 px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                        <h4 className="text-xl font-bold mt-2">{item.title}</h4>
                        <p className="text-gray-200">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Blog</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Peyzaj ve bahçe bakımı hakkında faydalı bilgiler
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-semibold mt-4 mb-2">{post.title}</h3>
                    <p className="text-gray-600 line-clamp-3">{post.content}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="mt-4 text-green-600 font-medium hover:text-green-700"
                    >
                      Devamını Oku →
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="iletisim" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">İletişim</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Projeleriniz için ücretsiz keşif randevusu alın
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-4">İletişim Bilgileri</h3>
                    <div className="space-y-4">
                      <a 
                        href="https://wa.me/905416459107"
                        className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <FaWhatsapp className="w-6 h-6 mr-3" />
                        <span>+90 541 645 91 07</span>
                      </a>
                      <a 
                        href="tel:+905416459107"
                        className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <FaPhone className="w-6 h-6 mr-3" />
                        <span>+90 541 645 91 07</span>
                      </a>
                      <a 
                        href="mailto:info@yesilyurtpeyzaj.com"
                        className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <FaEnvelope className="w-6 h-6 mr-3" />
                        <span>info@yesilyurtpeyzaj.com</span>
                      </a>
                      <a 
                        href="https://goo.gl/maps/123"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <FaMapMarkerAlt className="w-6 h-6 mr-3" />
                        <span>Eminceler, Serik / Antalya</span>
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Çalışma Saatleri</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>Pazartesi - Cumartesi: 08:00 - 18:00</p>
                      <p>Pazar: Kapalı</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      href="https://wa.me/905416459107"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                    >
                      <FaWhatsapp size={24} />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      href="https://www.facebook.com/p/Ye%C5%9Filyurt-S%C3%9CS-Bitkileri-Peyzaj-100063236448530/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaFacebook size={24} />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      href="https://www.instagram.com/yesilyurt__peyzaj/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700"
                    >
                      <FaInstagram size={24} />
                    </motion.a>
                  </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Adınız Soyadınız
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition-colors"
                      /> ```
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        E-posta Adresiniz
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon Numaranız
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                        Hizmet Seçin
                      </label>
                      <select
                        id="service"
                        name="service"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition-colors"
                      >
                        <option value="">Seçiniz</option>
                        <option value="peyzaj">Peyzaj Tasarımı</option>
                        <option value="uretim">Üretim</option>
                        <option value="uygulama">Uygulama</option>
                        <option value="bakim">Bahçe Bakımı</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Mesajınız
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition-colors"
                      ></textarea>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Gönder
                    </motion.button>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src="/logo.png" 
                alt="Yeşilyurt Peyzaj Logo" 
                className="h-16 mb-4 brightness-0 invert opacity-90"
              />
              <p className="text-gray-400">
                20 yıllık deneyimimizle modern ve sürdürülebilir peyzaj çözümleri sunuyoruz.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hizmetler</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Peyzaj Tasarımı</li>
                <li>Üretim</li>
                <li>Uygulama</li>
                <li>Bahçe Bakımı</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#hizmetler" className="hover:text-white transition-colors">Hizmetler</a></li>
                <li><a href="#projeler" className="hover:text-white transition-colors">Projeler</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#hakkimizda" className="hover:text-white transition-colors">Hakkımızda</a></li>
                <li><a href="#iletisim" className="hover:text-white transition-colors">İletişim</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">İletişim</h4>
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
                  href="https://www.facebook.com/p/Ye%C5%9Filyurt-S%C3%9CS-Bitkileri-Peyzaj-100063236448530/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <FaFacebook size={24} />
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

export default App;