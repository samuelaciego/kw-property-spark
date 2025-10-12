import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Facebook, Instagram, Video, Copy, Download, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialMediaPreviewProps {
  platform: 'facebook' | 'instagram' | 'tiktok';
  imageUrl?: string;
  content: string;
  isConnected: boolean;
  onPublish: () => void;
  isPublishing: boolean;
  publishSuccess?: boolean;
  publishUrl?: string;
}

export const SocialMediaPreview = ({
  platform,
  imageUrl,
  content,
  isConnected,
  onPublish,
  isPublishing,
  publishSuccess,
  publishUrl
}: SocialMediaPreviewProps) => {
  const { toast } = useToast();

  const platformConfig = {
    facebook: {
      icon: Facebook,
      name: 'Facebook',
      color: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
      emoji: '📘'
    },
    instagram: {
      icon: Instagram,
      name: 'Instagram',
      color: 'bg-pink-100 dark:bg-pink-900',
      iconColor: 'text-pink-600 dark:text-pink-400',
      emoji: '📱'
    },
    tiktok: {
      icon: Video,
      name: 'TikTok',
      color: 'bg-gray-100 dark:bg-gray-800',
      iconColor: 'text-gray-900 dark:text-gray-100',
      emoji: '🎵'
    }
  };

  const config = platformConfig[platform];
  const Icon = config.icon;

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Texto copiado",
      description: "El contenido se copió al portapapeles"
    });
  };

  const handleDownloadImage = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${platform}-image.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Imagen descargada",
        description: "La imagen se descargó correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar la imagen",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${config.color}`}>
              <Icon className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {config.emoji} {config.name}
              </h3>
              {isConnected ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Conectado
                </Badge>
              ) : (
                <Badge variant="outline">No conectado</Badge>
              )}
            </div>
          </div>
          
          {publishSuccess && publishUrl && (
            <a 
              href={publishUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Ver publicación <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-3">
            {imageUrl ? (
              <>
                <img 
                  src={imageUrl} 
                  alt={`${config.name} preview`}
                  className="w-full rounded-lg shadow-md border"
                />
                <Button
                  onClick={handleDownloadImage}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar imagen
                </Button>
              </>
            ) : (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-dashed">
                <p className="text-sm text-muted-foreground">Sin imagen generada</p>
              </div>
            )}
          </div>

          {/* Content Preview */}
          <div className="space-y-3 flex flex-col">
            <div className="flex-1 bg-muted/50 rounded-lg p-4 border">
              <p className="text-sm whitespace-pre-wrap">{content || 'Sin contenido generado'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleCopyContent}
                variant="outline"
                size="sm"
                disabled={!content}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar texto
              </Button>
              
              <Button
                onClick={onPublish}
                disabled={!isConnected || isPublishing || !content}
                size="sm"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publicando...
                  </>
                ) : publishSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publicado
                  </>
                ) : (
                  'Publicar'
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
