import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Image as ImageIcon, Loader2 } from 'lucide-react';

interface GeneratedImagesPreviewProps {
  images: {
    instagram?: string;
    stories?: string;
    facebook?: string;
  };
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const GeneratedImagesPreview: React.FC<GeneratedImagesPreviewProps> = ({
  images,
  onRegenerate,
  isGenerating
}) => {
  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const imageConfigs = [
    {
      key: 'instagram',
      title: 'Instagram Feed',
      description: '1080x1080px',
      color: 'bg-pink-100 dark:bg-pink-900',
      url: images.instagram
    },
    {
      key: 'stories',
      title: 'Instagram Stories',
      description: '1080x1920px',
      color: 'bg-purple-100 dark:bg-purple-900',
      url: images.stories
    },
    {
      key: 'facebook',
      title: 'Facebook',
      description: '1200x630px',
      color: 'bg-blue-100 dark:bg-blue-900',
      url: images.facebook
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Imágenes Generadas
            </CardTitle>
            <CardDescription>
              Imágenes profesionales creadas con Templated.io
            </CardDescription>
          </div>
          <Button
            onClick={onRegenerate}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              'Regenerar Todas'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {imageConfigs.map((config) => (
            <div key={config.key} className="space-y-3">
              <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                {config.url ? (
                  <img
                    src={config.url}
                    alt={config.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{config.title}</h4>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                  <Badge variant="secondary" className={config.color}>
                    {config.key.charAt(0).toUpperCase() + config.key.slice(1)}
                  </Badge>
                </div>
                
                {config.url && (
                  <Button
                    onClick={() => downloadImage(config.url!, `${config.key}-image.png`)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
