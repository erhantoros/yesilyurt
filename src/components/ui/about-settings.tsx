import { useState } from 'react';
import { useAbout } from '@/hooks/use-about';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Button } from './button';
import { Textarea } from './textarea';
import { Image, Plus, Trash } from 'lucide-react';

export function AboutSettings() {
  const { aboutContent, loading, updateAboutContent, uploadTeamMemberImage } = useAbout();
  const [teamMemberImage, setTeamMemberImage] = useState<File | null>(null);
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: ''
  });

  const handleTeamMemberImageUpload = async () => {
    if (teamMemberImage) {
      try {
        const imageUrl = await uploadTeamMemberImage(teamMemberImage);
        setNewTeamMember({ ...newTeamMember, image_url: imageUrl });
        setTeamMemberImage(null);
      } catch (error) {
        console.error('Image upload error:', error);
      }
    }
  };

  const handleAddTeamMember = () => {
    if (!aboutContent) return;
    
    const updatedTeamMembers = [
      ...(aboutContent.team_members || []),
      newTeamMember
    ];

    updateAboutContent({
      ...aboutContent,
      team_members: updatedTeamMembers
    });

    setNewTeamMember({
      name: '',
      role: '',
      bio: '',
      image_url: ''
    });
  };

  const handleRemoveTeamMember = (index: number) => {
    if (!aboutContent) return;

    const updatedTeamMembers = aboutContent.team_members.filter((_, i) => i !== index);
    updateAboutContent({
      ...aboutContent,
      team_members: updatedTeamMembers
    });
  };

  const handleValueChange = (value: string, index: number) => {
    if (!aboutContent) return;

    const updatedValues = [...aboutContent.values];
    updatedValues[index] = value;
    updateAboutContent({
      ...aboutContent,
      values: updatedValues
    });
  };

  const handleAddValue = () => {
    if (!aboutContent) return;

    updateAboutContent({
      ...aboutContent,
      values: [...aboutContent.values, '']
    });
  };

  const handleRemoveValue = (index: number) => {
    if (!aboutContent) return;

    const updatedValues = aboutContent.values.filter((_, i) => i !== index);
    updateAboutContent({
      ...aboutContent,
      values: updatedValues
    });
  };

  if (!aboutContent) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Genel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Başlık</label>
            <Input
              value={aboutContent.title}
              onChange={(e) => updateAboutContent({ ...aboutContent, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">İçerik</label>
            <Textarea
              value={aboutContent.content}
              onChange={(e) => updateAboutContent({ ...aboutContent, content: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Misyon & Vizyon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Misyon</label>
            <Textarea
              value={aboutContent.mission}
              onChange={(e) => updateAboutContent({ ...aboutContent, mission: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vizyon</label>
            <Textarea
              value={aboutContent.vision}
              onChange={(e) => updateAboutContent({ ...aboutContent, vision: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Değerlerimiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aboutContent.values.map((value, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={value}
                  onChange={(e) => handleValueChange(e.target.value, index)}
                  placeholder={`Değer ${index + 1}`}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveValue(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={handleAddValue} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Değer Ekle
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tarihçe</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={aboutContent.history}
            onChange={(e) => updateAboutContent({ ...aboutContent, history: e.target.value })}
            rows={6}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>İstatistikler</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deneyim (Yıl)</label>
            <Input
              type="number"
              value={aboutContent.stats.years_experience}
              onChange={(e) => updateAboutContent({
                ...aboutContent,
                stats: { ...aboutContent.stats, years_experience: parseInt(e.target.value) }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tamamlanan Proje</label>
            <Input
              type="number"
              value={aboutContent.stats.completed_projects}
              onChange={(e) => updateAboutContent({
                ...aboutContent,
                stats: { ...aboutContent.stats, completed_projects: parseInt(e.target.value) }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ekip Büyüklüğü</label>
            <Input
              type="number"
              value={aboutContent.stats.team_size}
              onChange={(e) => updateAboutContent({
                ...aboutContent,
                stats: { ...aboutContent.stats, team_size: parseInt(e.target.value) }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Müşteri Memnuniyeti (%)</label>
            <Input
              type="number"
              value={aboutContent.stats.client_satisfaction}
              onChange={(e) => updateAboutContent({
                ...aboutContent,
                stats: { ...aboutContent.stats, client_satisfaction: parseInt(e.target.value) }
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ekip Üyeleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Mevcut Ekip Üyeleri */}
            {aboutContent.team_members.map((member, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                      {member.image_url && (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <p className="text-sm">{member.bio}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveTeamMember(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Yeni Ekip Üyesi Ekleme */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Yeni Ekip Üyesi Ekle</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">İsim</label>
                  <Input
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pozisyon</label>
                  <Input
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Biyografi</label>
                  <Textarea
                    value={newTeamMember.bio}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, bio: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fotoğraf</label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setTeamMemberImage(e.target.files?.[0] || null)}
                    />
                    <Button
                      onClick={handleTeamMemberImageUpload}
                      disabled={!teamMemberImage}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      Yükle
                    </Button>
                  </div>
                  {newTeamMember.image_url && (
                    <img
                      src={newTeamMember.image_url}
                      alt="Preview"
                      className="mt-2 w-16 h-16 rounded-full object-cover"
                    />
                  )}
                </div>
                <Button
                  onClick={handleAddTeamMember}
                  disabled={!newTeamMember.name || !newTeamMember.role || !newTeamMember.bio}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ekip Üyesi Ekle
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}