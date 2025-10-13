import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SocialMediaPreview } from "@/components/social-media-preview";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  title: string | null;
  address: string | null;
  price: string | null;
  description: string | null;
  status: string | null;
  created_at: string;
  images: string[] | null;
  views: number | null;
  facebook_content: string | null;
  instagram_content: string | null;
  generated_image_facebook?: string | null;
  generated_image_instagram?: string | null;
  hashtags: string[] | null;
  agent_name: string | null;
  agent_phone: string | null;
  facebook_post_id: string | null;
  facebook_published_at: string | null;
  instagram_post_id: string | null;
  instagram_published_at: string | null;
  tiktok_video_id: string | null;
  tiktok_published_at: string | null;
}
const PropertyDetail = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    user,
    profile
  } = useAuth();
  const {
    toast
  } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishingState, setPublishingState] = useState({
    instagram: false,
    facebook: false,
    tiktok: false
  });

  const getPlatformPostUrl = (platform: string, postId: string): string | undefined => {
    switch (platform) {
      case 'facebook':
        return `https://facebook.com/${postId}`;
      case 'instagram':
        return `https://instagram.com/p/${postId}`;
      case 'tiktok':
        return `https://tiktok.com/@username/video/${postId}`;
      default:
        return undefined;
    }
  };

  const handlePublish = async (platform: 'instagram' | 'facebook' | 'tiktok') => {
    if (!property) return;
    
    setPublishingState(prev => ({ ...prev, [platform]: true }));
    
    try {
      const imageUrlMap = {
        instagram: property.generated_image_instagram,
        facebook: property.generated_image_facebook
      };
      
      const { data, error } = await supabase.functions.invoke(
        `publish-${platform}`,
        {
          body: {
            propertyId: property.id,
            content: property[`${platform}_content`],
            imageUrl: imageUrlMap[platform]
          }
        }
      );
      
      if (error) throw error;
      
      setProperty(prev => prev ? {
        ...prev,
        [`${platform}_post_id`]: data.postId,
        [`${platform}_published_at`]: new Date().toISOString()
      } : null);
      
      toast({
        title: "¡Publicado!",
        description: `Contenido publicado exitosamente en ${platform}`
      });
    } catch (error) {
      console.error(`Error publishing to ${platform}:`, error);
      toast({
        title: "Error",
        description: `No se pudo publicar en ${platform}`,
        variant: "destructive"
      });
    } finally {
      setPublishingState(prev => ({ ...prev, [platform]: false }));
    }
  };
  useEffect(() => {
    if (!user || !id) return;
    const loadProperty = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from("properties").select("*").eq("id", id).eq("user_id", user.id).single();
        if (error) {
          console.error("Error loading property:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la propiedad",
            variant: "destructive"
          });
          navigate("/dashboard");
          return;
        }
        setProperty(data);
      } catch (error) {
        console.error("Error:", error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [user, id, navigate, toast]);
  if (loading) {
    return <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando propiedad...</p>
          </div>
        </div>
      </AppLayout>;
  }
  if (!property) {
    return <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Propiedad no encontrada</h2>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
      </AppLayout>;
  }
  return <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Button>
        </div>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mb-4 text-4xl">✅</div>
              <h3 className="text-xl font-semibold mb-2">
                ¡Contenido listo para compartir!
              </h3>
              <p className="text-muted-foreground">
                Imágenes y textos generados para redes sociales
              </p>
            </div>
          </CardContent>
        </Card>

        {(['instagram', 'facebook'] as const).map(platform => {
          const imageUrlMap = {
            instagram: property.generated_image_instagram,
            facebook: property.generated_image_facebook
          };
          
          return (
            <SocialMediaPreview
              key={platform}
              platform={platform}
              imageUrl={imageUrlMap[platform] || undefined}
              content={property[`${platform}_content`] || ''}
              isConnected={(profile as any)?.[`${platform}_connected`] || false}
              onPublish={() => handlePublish(platform)}
              isPublishing={publishingState[platform]}
              publishSuccess={property[`${platform}_published_at`] !== null}
              publishUrl={property[`${platform}_post_id`] 
                ? getPlatformPostUrl(platform, property[`${platform}_post_id`])
                : undefined
              }
            />
          );
        })}
      </div>
    </AppLayout>;
};
export default PropertyDetail;