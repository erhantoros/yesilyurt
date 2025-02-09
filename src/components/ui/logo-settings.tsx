import { useState } from 'react';
import { useLogo } from '@/hooks/use-logo';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Button } from './button';
import { Image } from 'lucide-react';

export function LogoSettings() {
  const { logoSettings, loading, updateLogo } = useLogo();
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [footerFile, setFooterFile] = useState<File | null>(null);

  const handleHeaderLogoUpdate = async () => {
    if (headerFile) {
      await updateLogo(headerFile, 'header');
      setHeaderFile(null);
    }
  };

  const handleFooterLogoUpdate = async () => {
    if (footerFile) {
      await updateLogo(footerFile, 'footer');
      setFooterFile(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Logo */}
        <div>
          <h3 className="text-lg font-medium mb-4">Header Logo</h3>
          {logoSettings?.header_logo && (
            <div className="mb-4">
              <img
                src={logoSettings.header_logo}
                alt="Header Logo"
                className="h-16 object-contain"
              />
            </div>
          )}
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setHeaderFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button
              onClick={handleHeaderLogoUpdate}
              disabled={!headerFile || loading}
            >
              <Image className="mr-2 h-4 w-4" />
              Güncelle
            </Button>
          </div>
        </div>

        {/* Footer Logo */}
        <div>
          <h3 className="text-lg font-medium mb-4">Footer Logo</h3>
          {logoSettings?.footer_logo && (
            <div className="mb-4">
              <img
                src={logoSettings.footer_logo}
                alt="Footer Logo"
                className="h-16 object-contain"
              />
            </div>
          )}
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFooterFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button
              onClick={handleFooterLogoUpdate}
              disabled={!footerFile || loading}
            >
              <Image className="mr-2 h-4 w-4" />
              Güncelle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}