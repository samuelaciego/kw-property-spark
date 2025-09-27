import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Facebook, Instagram, Video, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialMediaPublisherProps {
  propertyData: any;
  profile: any;
}

interface PublishResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export const SocialMediaPublisher: React.FC<SocialMediaPublisherProps> = ({ 
  propertyData, 
  profile 
}) => {
  const [customCaptions, setCustomCaptions] = useState({
    facebook: '',
    instagram: '',
    tiktok: ''
  });

  const [publishing, setPublishing] = useState({
    facebook: false,
    instagram: false,
    tiktok: false
  });

  const [generatingAI, setGeneratingAI] = useState({
    facebook: false,
    instagram: false,
    tiktok: false
  });

  const [publishResults, setPublishResults] = useState<{
    facebook?: PublishResult;
    instagram?: PublishResult;
    tiktok?: PublishResult;
  }>({});

  const [contentGenerated, setContentGenerated] = useState(false);

  const { toast } = useToast();

  // Auto-generate content when component mounts
  useEffect(() => {
    if (propertyData && !contentGenerated) {
      generateAllContent();
    }
  }, [propertyData, contentGenerated]);

  const generateAllContent = async () => {
    const platforms = ['facebook', 'instagram', 'tiktok'] as const;
    
    setGeneratingAI({
      facebook: true,
      instagram: true,
      tiktok: true
    });

    try {
      const promises = platforms.map(async (platform) => {
        const { data, error } = await supabase.functions.invoke('generate-social-content', {
          body: {
            platform,
            propertyData: {
              title: propertyData.title,
              description: propertyData.description,
              price: propertyData.price,
              address: propertyData.address
            }
          }
        });

        if (error) throw new Error(`Error generating ${platform} content: ${error.message}`);
        
        return { platform, content: data.generatedContent };
      });

      const results = await Promise.all(promises);
      
      const newCaptions = { facebook: '', instagram: '', tiktok: '' };
      results.forEach(({ platform, content }) => {
        newCaptions[platform] = content;
      });

      setCustomCaptions(newCaptions);
      setContentGenerated(true);
      
      toast({
        title: "¡Contenido generado!",
        description: "Contenido para todas las redes sociales generado con IA exitosamente."
      });

    } catch (error: any) {
      console.error('AI generation error:', error);
      toast({
        title: "Error al generar contenido",
        description: error.message || "No se pudo generar el contenido con IA.",
        variant: "destructive"
      });
      
      // Fallback to original content
      setCustomCaptions({
        facebook: propertyData.social_content || '',
        instagram: propertyData.social_content || '',
        tiktok: propertyData.title || ''
      });
    } finally {
      setGeneratingAI({
        facebook: false,
        instagram: false,
        tiktok: false
      });
    }
  };

  const generateWithAI = async (platform: 'facebook' | 'instagram' | 'tiktok') => {
    setGeneratingAI(prev => ({ ...prev, [platform]: true }));

    try {
      const { data, error } = await supabase.functions.invoke('generate-social-content', {
        body: {
          platform,
          propertyData: {
            title: propertyData.title,
            description: propertyData.description,
            price: propertyData.price,
            address: propertyData.address
          }
        }
      });

      if (error) throw error;

      setCustomCaptions(prev => ({ 
        ...prev, 
        [platform]: data.generatedContent 
      }));
      
      toast({
        title: "¡Contenido generado!",
        description: `Contenido para ${platform} generado con IA exitosamente.`
      });

    } catch (error: any) {
      console.error(`AI generation error for ${platform}:`, error);
      toast({
        title: "Error al generar contenido",
        description: error.message || "No se pudo generar el contenido con IA.",
        variant: "destructive"
      });
    } finally {
      setGeneratingAI(prev => ({ ...prev, [platform]: false }));
    }
  };

  const publishToFacebook = async () => {
    if (!profile?.facebook_connected) {
      toast({
        title: "Facebook no conectado",
        description: "Primero conecta tu cuenta de Facebook en el perfil.",
        variant: "destructive"
      });
      return;
    }

    setPublishing(prev => ({ ...prev, facebook: true }));

    try {
      const { data, error } = await supabase.functions.invoke('publish-facebook', {
        body: {
          propertyId: propertyData.id,
          imageUrls: propertyData.images,
          caption: customCaptions.facebook,
          hashtags: propertyData.hashtags || []
        }
      });

      if (error) throw error;

      setPublishResults(prev => ({ ...prev, facebook: data }));
      
      toast({
        title: "¡Publicado en Facebook!",
        description: "Tu propiedad ha sido publicada exitosamente en Facebook."
      });

    } catch (error: any) {
      console.error('Facebook publish error:', error);
      setPublishResults(prev => ({ 
        ...prev, 
        facebook: { success: false, error: error.message } 
      }));
      
      toast({
        title: "Error al publicar en Facebook",
        description: error.message || "No se pudo publicar en Facebook.",
        variant: "destructive"
      });
    } finally {
      setPublishing(prev => ({ ...prev, facebook: false }));
    }
  };

  const publishToInstagram = async () => {
    if (!profile?.instagram_connected) {
      toast({
        title: "Instagram no conectado",
        description: "Primero conecta tu cuenta de Instagram en el perfil.",
        variant: "destructive"
      });
      return;
    }

    setPublishing(prev => ({ ...prev, instagram: true }));

    try {
      const { data, error } = await supabase.functions.invoke('publish-instagram', {
        body: {
          propertyId: propertyData.id,
          imageUrls: propertyData.images,
          caption: customCaptions.instagram,
          hashtags: propertyData.hashtags || []
        }
      });

      if (error) throw error;

      setPublishResults(prev => ({ ...prev, instagram: data }));
      
      toast({
        title: "¡Publicado en Instagram!",
        description: "Tu propiedad ha sido publicada exitosamente en Instagram."
      });

    } catch (error: any) {
      console.error('Instagram publish error:', error);
      setPublishResults(prev => ({ 
        ...prev, 
        instagram: { success: false, error: error.message } 
      }));
      
      toast({
        title: "Error al publicar en Instagram",
        description: error.message || "No se pudo publicar en Instagram.",
        variant: "destructive"
      });
    } finally {
      setPublishing(prev => ({ ...prev, instagram: false }));
    }
  };

  const createTikTokVideo = async () => {
    if (!profile?.tiktok_connected) {
      toast({
        title: "TikTok no conectado",
        description: "Primero conecta tu cuenta de TikTok en el perfil.",
        variant: "destructive"
      });
      return;
    }

    setPublishing(prev => ({ ...prev, tiktok: true }));

    try {
      const { data, error } = await supabase.functions.invoke('create-tiktok-video', {
        body: {
          propertyId: propertyData.id,
          imageUrls: propertyData.images,
          title: customCaptions.tiktok,
          description: propertyData.description
        }
      });

      if (error) throw error;

      setPublishResults(prev => ({ ...prev, tiktok: data }));
      
      toast({
        title: "Video de TikTok iniciado",
        description: "Se ha iniciado la creación del video. Consulta los logs para más detalles."
      });

    } catch (error: any) {
      console.error('TikTok video error:', error);
      setPublishResults(prev => ({ 
        ...prev, 
        tiktok: { success: false, error: error.message } 
      }));
      
      toast({
        title: "Error al crear video de TikTok",
        description: error.message || "No se pudo crear el video de TikTok.",
        variant: "destructive"
      });
    } finally {
      setPublishing(prev => ({ ...prev, tiktok: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Publicar en Redes Sociales
        </CardTitle>
        <CardDescription>
          Publica esta propiedad en tus redes sociales conectadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Facebook Publishing */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900">
                <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">Facebook</h4>
                {profile?.facebook_connected ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Conectado
                  </Badge>
                ) : (
                  <Badge variant="outline">No conectado</Badge>
                )}
              </div>
            </div>
            
            {publishResults.facebook?.success && (
              <a 
                href={publishResults.facebook.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                Ver post <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          
          <div className="space-y-3">
            {generatingAI.facebook ? (
              <div className="flex items-center justify-center p-8 border border-dashed rounded-lg">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Generando contenido con IA...</p>
                </div>
              </div>
            ) : (
              <Textarea
                placeholder="Contenido generado automáticamente con Gemini..."
                value={customCaptions.facebook}
                onChange={(e) => setCustomCaptions(prev => ({ ...prev, facebook: e.target.value }))}
                className="min-h-[120px]"
              />
            )}
            
            <Button
              onClick={publishToFacebook}
              disabled={!profile?.facebook_connected || publishing.facebook}
              className="w-full"
            >
              {publishing.facebook ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar en Facebook'
              )}
            </Button>
            
            {publishResults.facebook?.error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                Error: {publishResults.facebook.error}
              </div>
            )}
          </div>
        </div>

        {/* Instagram Publishing */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-100 rounded-full dark:bg-pink-900">
                <Instagram className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h4 className="font-medium">Instagram</h4>
                {profile?.instagram_connected ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Conectado
                  </Badge>
                ) : (
                  <Badge variant="outline">No conectado</Badge>
                )}
              </div>
            </div>
            
            {publishResults.instagram?.success && (
              <a 
                href={publishResults.instagram.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-pink-600 hover:underline flex items-center gap-1"
              >
                Ver post <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          
          <div className="space-y-3">
            {generatingAI.instagram ? (
              <div className="flex items-center justify-center p-8 border border-dashed rounded-lg">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Generando contenido con IA...</p>
                </div>
              </div>
            ) : (
              <Textarea
                placeholder="Contenido generado automáticamente con Gemini..."
                value={customCaptions.instagram}
                onChange={(e) => setCustomCaptions(prev => ({ ...prev, instagram: e.target.value }))}
                className="min-h-[120px]"
              />
            )}
            
            <Button
              onClick={publishToInstagram}
              disabled={!profile?.instagram_connected || publishing.instagram}
              className="w-full"
            >
              {publishing.instagram ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar en Instagram'
              )}
            </Button>
            
            {publishResults.instagram?.error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                Error: {publishResults.instagram.error}
              </div>
            )}
          </div>
        </div>

        {/* TikTok Video Creation */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-full dark:bg-gray-800">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">TikTok</h4>
                {profile?.tiktok_connected ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Conectado
                  </Badge>
                ) : (
                  <Badge variant="outline">No conectado</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {generatingAI.tiktok ? (
              <div className="flex items-center justify-center p-8 border border-dashed rounded-lg">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Generando contenido con IA...</p>
                </div>
              </div>
            ) : (
              <Textarea
                placeholder="Contenido generado automáticamente con Gemini..."
                value={customCaptions.tiktok}
                onChange={(e) => setCustomCaptions(prev => ({ ...prev, tiktok: e.target.value }))}
                className="min-h-[120px]"
              />
            )}
            
            <Button
              onClick={createTikTokVideo}
              disabled={!profile?.tiktok_connected || publishing.tiktok}
              className="w-full"
              variant="outline"
            >
              {publishing.tiktok ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando video...
                </>
              ) : (
                'Crear Video para TikTok'
              )}
            </Button>
            
            {publishResults.tiktok?.error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                Error: {publishResults.tiktok.error}
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Nota:</strong> Asegúrate de tener las cuentas conectadas antes de publicar. 
            Las publicaciones se realizan usando tus propios tokens de acceso OAuth.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};