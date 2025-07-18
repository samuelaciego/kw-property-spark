import { useState } from "react";
import { Facebook, Instagram, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [loading, setLoading] = useState(false);

  const [connections, setConnections] = useState({
    facebook: {
      connected: profile?.facebook_connected || false,
      pageId: profile?.facebook_page_id || "",
    },
    instagram: {
      connected: profile?.instagram_connected || false,
      accountId: profile?.instagram_account_id || "",
    },
    tiktok: {
      connected: profile?.tiktok_connected || false,
      username: profile?.tiktok_username || "",
    },
  });

  const handleConnect = async (platform: 'facebook' | 'instagram' | 'tiktok') => {
    setLoading(true);
    try {
      const updates: any = {};
      
      if (platform === 'facebook') {
        updates.facebook_connected = true;
        updates.facebook_page_id = connections.facebook.pageId;
      } else if (platform === 'instagram') {
        updates.instagram_connected = true;
        updates.instagram_account_id = connections.instagram.accountId;
      } else if (platform === 'tiktok') {
        updates.tiktok_connected = true;
        updates.tiktok_username = connections.tiktok.username;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', profile.user_id);

      if (error) throw error;

      setConnections(prev => ({
        ...prev,
        [platform]: { ...prev[platform], connected: true }
      }));

      toast({
        title: t.connected,
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} ${t.connected.toLowerCase()}`,
      });

      onUpdate();
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
      toast({
        title: "Error",
        description: `Error al conectar ${platform}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (platform: 'facebook' | 'instagram' | 'tiktok') => {
    setLoading(true);
    try {
      const updates: any = {};
      
      if (platform === 'facebook') {
        updates.facebook_connected = false;
        updates.facebook_page_id = null;
        updates.facebook_access_token = null;
      } else if (platform === 'instagram') {
        updates.instagram_connected = false;
        updates.instagram_account_id = null;
        updates.instagram_access_token = null;
      } else if (platform === 'tiktok') {
        updates.tiktok_connected = false;
        updates.tiktok_username = null;
        updates.tiktok_access_token = null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', profile.user_id);

      if (error) throw error;

      setConnections(prev => ({
        ...prev,
        [platform]: { ...prev[platform], connected: false }
      }));

      toast({
        title: t.disconnect,
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} desconectado`,
      });

      onUpdate();
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
      toast({
        title: "Error",
        description: `Error al desconectar ${platform}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          Conecta tus redes sociales para publicar automáticamente el contenido generado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Facebook */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Facebook className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-medium">Facebook</h3>
                <p className="text-sm text-muted-foreground">
                  {connections.facebook.connected ? t.connected : t.notConnected}
                </p>
              </div>
            </div>
            {connections.facebook.connected ? (
              <Button
                variant="outline"
                onClick={() => handleDisconnect('facebook')}
                disabled={loading}
              >
                {t.disconnect}
              </Button>
            ) : (
              <Button
                onClick={() => handleConnect('facebook')}
                disabled={loading || !connections.facebook.pageId}
              >
                {t.connectFacebook}
              </Button>
            )}
          </div>
          {!connections.facebook.connected && (
            <div className="space-y-2">
              <Label htmlFor="facebook-page-id">{t.facebookPageId}</Label>
              <Input
                id="facebook-page-id"
                value={connections.facebook.pageId}
                onChange={(e) => setConnections(prev => ({
                  ...prev,
                  facebook: { ...prev.facebook, pageId: e.target.value }
                }))}
                placeholder="123456789"
              />
            </div>
          )}
        </div>

        {/* Instagram */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Instagram className="h-6 w-6 text-pink-600" />
              <div>
                <h3 className="font-medium">Instagram</h3>
                <p className="text-sm text-muted-foreground">
                  {connections.instagram.connected ? t.connected : t.notConnected}
                </p>
              </div>
            </div>
            {connections.instagram.connected ? (
              <Button
                variant="outline"
                onClick={() => handleDisconnect('instagram')}
                disabled={loading}
              >
                {t.disconnect}
              </Button>
            ) : (
              <Button
                onClick={() => handleConnect('instagram')}
                disabled={loading || !connections.instagram.accountId}
              >
                {t.connectInstagram}
              </Button>
            )}
          </div>
          {!connections.instagram.connected && (
            <div className="space-y-2">
              <Label htmlFor="instagram-account-id">{t.instagramAccountId}</Label>
              <Input
                id="instagram-account-id"
                value={connections.instagram.accountId}
                onChange={(e) => setConnections(prev => ({
                  ...prev,
                  instagram: { ...prev.instagram, accountId: e.target.value }
                }))}
                placeholder="123456789"
              />
            </div>
          )}
        </div>

        {/* TikTok */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <VideoIcon className="h-6 w-6 text-black" />
              <div>
                <h3 className="font-medium">TikTok</h3>
                <p className="text-sm text-muted-foreground">
                  {connections.tiktok.connected ? t.connected : t.notConnected}
                </p>
              </div>
            </div>
            {connections.tiktok.connected ? (
              <Button
                variant="outline"
                onClick={() => handleDisconnect('tiktok')}
                disabled={loading}
              >
                {t.disconnect}
              </Button>
            ) : (
              <Button
                onClick={() => handleConnect('tiktok')}
                disabled={loading || !connections.tiktok.username}
              >
                {t.connectTiktok}
              </Button>
            )}
          </div>
          {!connections.tiktok.connected && (
            <div className="space-y-2">
              <Label htmlFor="tiktok-username">{t.tiktokUsername}</Label>
              <Input
                id="tiktok-username"
                value={connections.tiktok.username}
                onChange={(e) => setConnections(prev => ({
                  ...prev,
                  tiktok: { ...prev.tiktok, username: e.target.value }
                }))}
                placeholder="@usuario"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}