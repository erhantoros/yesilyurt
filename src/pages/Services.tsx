import { motion } from 'framer-motion';
import { Shovel, Sprout, Camera, TreePine } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Services() {
  const services = [
    {
      icon: <Shovel className="h-12 w-12" />,
      title: 'Peyzaj Uygulama',
      description: 'Profesyonel ekibimizle hayalinizdeki bahçeyi gerçeğe dönüştürüyoruz.'
    },
    {
      icon: <Sprout className="h-12 w-12" />,
      title: 'Bitki Üretimi',
      description: 'Kendi üretim alanlarımızda yetiştirdiğimiz bitkilerle projenizi şekillendiriyoruz.'
    },
    {
      icon: <Camera className="h-12 w-12" />,
      title: '3D Tasarım',
      description: 'Modern teknolojilerle projenizi önceden görselleştiriyoruz.'
    }
  ];

  return (
    <Layout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Hizmetlerimiz</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Size özel profesyonel peyzaj çözümleri sunuyoruz. Her projeye özgün yaklaşım ve deneyimli ekibimizle hizmetinizdeyiz.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="card-hover p-6 rounded-lg"
              >
                <div className="text-green-600 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">Neden Bizi Seçmelisiniz?</h2>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <TreePine className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Uzman Ekip</h3>
                    <p className="text-gray-600">20 yıllık deneyime sahip profesyonel kadromuzla hizmetinizdeyiz.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <TreePine className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Kaliteli Malzeme</h3>
                    <p className="text-gray-600">En kaliteli bitki ve malzemeleri kullanarak uzun ömürlü çözümler sunuyoruz.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <TreePine className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Sürdürülebilir Tasarım</h3>
                    <p className="text-gray-600">Çevre dostu ve sürdürülebilir peyzaj çözümleri üretiyoruz.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <img
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae"
                alt="Peyzaj Hizmetleri"
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}