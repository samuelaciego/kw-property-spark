import { useState } from "react";
import { Facebook, Instagram, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SocialMediaConnectionsProps {
  profile: any;
  onUpdate: () => void;
}

export function SocialMediaConnections({ profile, onUpdate }: SocialMediaConnectionsProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState({
    facebook: false,
    instagram: false,
    tiktok: false
  });

  const handleOAuthConnect = async (platform: 'facebook' | 'instagram' | 'tiktok') => {
    setIsConnecting(prev => ({ ...prev, [platform]: true }));
    
    try {
      let functionName = '';
      
      if (platform === 'facebook' || platform === 'instagram') {
        functionName = 'oauth-facebook';
      } else if (platform === 'tiktok') {
        functionName = 'oauth-tiktok';
      }

      const { data, error } = await supabase.functions.invoke(functionName + `?action=get_auth_url&user_id=${profile.user_id}`);

      if (error) throw error;

      // Open OAuth popup
      const popup = window.open(
        data.authUrl, 
        'oauth_popup',
        'width=600,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for popup close or success
      const checkPopup = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopup);
          setIsConnecting(prev => ({ ...prev, [platform]: false }));
          
          // Wait a bit and refresh profile
          setTimeout(() => {
            onUpdate();
            toast({
              title: "Conexión completada",
              description: `Revisa si ${platform} se conectó correctamente.`,
            });
          }, 1000);
        }
      }, 1000);

    } catch (error: any) {
      console.error(`Error connecting to ${platform}:`, error);
      toast({
        title: "Error de conexión",
        description: `No se pudo conectar con ${platform}. Inténtalo de nuevo.`,
        variant: "destructive",
      });
      setIsConnecting(prev => ({ ...prev, [platform]: false }));
    }
  };

  const handleDisconnect = async (platform: 'facebook' | 'instagram' | 'tiktok') => {
    try {
      const updates: any = {};
      
      if (platform === 'facebook') {
        updates.facebook_connected = false;
        updates.facebook_access_token = null;
        updates.facebook_page_id = null;
      } else if (platform === 'instagram') {
        updates.instagram_connected = false;
        updates.instagram_access_token = null;
        updates.instagram_account_id = null;
      } else if (platform === 'tiktok') {
        updates.tiktok_connected = false;
        updates.tiktok_access_token = null;
        updates.tiktok_username = null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', profile.user_id);

      if (error) throw error;

      toast({
        title: "Desconectado exitosamente",
        description: `${platform === 'facebook' ? 'Facebook' : platform === 'instagram' ? 'Instagram' : 'TikTok'} ha sido desconectado.`,
      });

      onUpdate();
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
      toast({
        title: "Error",
        description: `No se pudo desconectar de ${platform}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <VideoIcon className="h-5 w-5" />
          {t.socialMediaConnections}
        </CardTitle>
        <CardDescription>
          Conecta tus redes sociales usando OAuth para publicar automáticamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Facebook */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900">
              <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium">Facebook</h4>
              <p className="text-sm text-muted-foreground">
                Publica en tu página de Facebook
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {profile?.facebook_connected ? (
              <>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {t.connected}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnect('facebook')}
                >
                  {t.disconnect}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleOAuthConnect('facebook')}
                disabled={isConnecting.facebook}
                size="sm"
              >
                {isConnecting.facebook ? 'Conectando...' : t.connectFacebook}
              </Button>
            )}
          </div>
        </div>

        {/* Instagram */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-full dark:bg-pink-900">
              <Instagram className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h4 className="font-medium">Instagram</h4>
              <p className="text-sm text-muted-foreground">
                Publica fotos en tu cuenta de Instagram Business
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {profile?.instagram_connected ? (
              <>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {t.connected}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnect('instagram')}
                >
                  {t.disconnect}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleOAuthConnect('instagram')}
                disabled={isConnecting.instagram}
                size="sm"
                variant="outline"
              >
                {isConnecting.instagram ? 'Conectando...' : 'Conectar vía Facebook'}
              </Button>
            )}
          </div>
        </div>

        {/* TikTok */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-full dark:bg-gray-800">
              <VideoIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium">TikTok</h4>
              <p className="text-sm text-muted-foreground">
                Crea y sube videos automáticamente
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {profile?.tiktok_connected ? (
              <>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {t.connected}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnect('tiktok')}
                >
                  {t.disconnect}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleOAuthConnect('tiktok')}
                disabled={isConnecting.tiktok}
                size="sm"
              >
                {isConnecting.tiktok ? 'Conectando...' : t.connectTiktok}
              </Button>
            )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          <p>
            <strong>Nota:</strong> Las conexiones OAuth son seguras y te permiten publicar usando tus propias credenciales. 
            Puedes desconectarlas en cualquier momento.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}