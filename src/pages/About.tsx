import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { useAbout } from '@/hooks/use-about';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { TreePine, Target, Eye, History, Users } from 'lucide-react';

export default function About() {
  const { aboutContent } = useAbout();

  if (!aboutContent) return null;

  return (
    <Layout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">{aboutContent.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {aboutContent.content}
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {aboutContent.stats.years_experience}+
                </div>
                <div className="text-sm text-gray-600">Yıllık Deneyim</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {aboutContent.stats.completed_projects}+
                </div>
                <div className="text-sm text-gray-600">Tamamlanan Proje</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {aboutContent.stats.team_size}+
                </div>
                <div className="text-sm text-gray-600">Uzman Personel</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  %{aboutContent.stats.client_satisfaction}
                </div>
                <div className="text-sm text-gray-600">Müşteri Memnuniyeti</div>
              </CardContent>
            </Card>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Target className="h-6 w-6 text-green-600 mr-2" />
                    <h2 className="text-2xl font-semibold">Misyonumuz</h2>
                  </div>
                  <p className="text-gray-600">{aboutContent.mission}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Eye className="h-6 w-6 text-green-600 mr-2" />
                    <h2 className="text-2xl font-semibold">Vizyonumuz</h2>
                  </div>
                  <p className="text-gray-600">{aboutContent.vision}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Değerlerimiz</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {aboutContent.values.map((value, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                        <TreePine className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <History className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-2xl font-semibold">Tarihçemiz</h2>
                </div>
                <p className="text-gray-600">{aboutContent.history}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Users className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-2xl font-semibold">Ekibimiz</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aboutContent.team_members.map((member, index) => (
                    <div key={index} className="text-center">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 mx-auto rounded-full mb-4 bg-green-100 flex items-center justify-center">
                          <Users className="h-12 w-12 text-green-600" />
                        </div>
                      )}
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <div className="text-green-600 mb-2">{member.role}</div>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}