import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialMediaConnections } from "@/components/social-media-connections";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { getAvailableLanguages, Language } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/app-layout";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  User, 
  Building, 
  Mail, 
  Crown,
  Save,
  Loader2,
  CreditCard,
  TrendingUp,
  Upload,
  Camera
} from "lucide-react";

export default function Profile() {
  const { profile, user, refreshProfile, loading: authLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    company: "",
    avatar_url: "",
  });
  const [avatarUrl, setAvatarUrl] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        company: profile.company || "",
        avatar_url: profile.avatar_url || "",
      });
      // Usar el campo user_avatar_url temporal hasta que se actualice el tipo
      setAvatarUrl((profile as any).user_avatar_url || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          company: formData.company,
          avatar_url: formData.avatar_url,
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido guardados exitosamente.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !profile) return;

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/agency-logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('agency-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('agency-logos')
        .getPublicUrl(fileName);

      // Actualizar inmediatamente en la base de datos
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', profile.user_id);

      if (updateError) throw updateError;

      setFormData({ ...formData, avatar_url: data.publicUrl });
      await refreshProfile();

      toast({
        title: "Logo subido",
        description: "El logo de tu agencia ha sido subido exitosamente.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el logo. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleUserAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !profile) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/user-avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('agency-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('agency-logos')
        .getPublicUrl(fileName);

      // Actualizar en la base de datos el campo específico para avatar personal
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_avatar_url: data.publicUrl })
        .eq('user_id', profile.user_id);

      if (updateError) throw updateError;

      setAvatarUrl(data.publicUrl);
      await refreshProfile();

      toast({
        title: "Avatar subido",
        description: "Tu foto de perfil ha sido subida exitosamente.",
      });
    } catch (error) {
      console.error('Error uploading user avatar:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el avatar. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-500 to-purple-700 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const usagePercentage = profile ? ((profile.usage_count || 0) / (profile.monthly_limit || 1)) * 100 : 0;

  if (authLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!user || !profile) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Acceso denegado</h1>
            <p className="text-muted-foreground">Debes iniciar sesión para ver tu perfil.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.profileTitle}</h1>
          <p className="text-muted-foreground">
            {t.personalInformation}
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Información Personal */}
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t.personalInformation}
              </CardTitle>
              <CardDescription>
                {t.personalInformation}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    El email no se puede cambiar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">{t.name}</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder={t.name}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">{t.company}</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t.company}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">{t.language}</Label>
                  <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.language} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableLanguages().map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                 <div className="space-y-2">
                   <Label>{t.agencyLogo}</Label>
                   <div className="flex items-center gap-4">
                     <Avatar className="h-20 w-20">
                       <AvatarImage src={formData.avatar_url} alt="Logo de la agencia" />
                       <AvatarFallback>
                         <Building className="h-8 w-8" />
                       </AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingLogo}
                          className="w-fit"
                        >
                          {uploadingLogo ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Subiendo...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              {t.uploadLogo}
                            </>
                          )}
                       </Button>
                       <p className="text-xs text-muted-foreground">
                         Formato recomendado: PNG o JPG, máximo 2MB
                       </p>
                     </div>
                     <input
                       ref={fileInputRef}
                       type="file"
                       accept="image/*"
                       onChange={handleAvatarUpload}
                       className="hidden"
                     />
                   </div>
                 </div>

                 {/* Avatar Personal */}
                 <div className="space-y-2">
                   <Label>Avatar Personal</Label>
                   <div className="flex items-center gap-4">
                     <Avatar className="h-16 w-16">
                       <AvatarImage src={avatarUrl} alt="Avatar personal" />
                       <AvatarFallback>
                         <User className="h-6 w-6" />
                       </AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={uploadingAvatar}
                          className="w-fit"
                        >
                          {uploadingAvatar ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Subiendo...
                            </>
                          ) : (
                            <>
                              <Camera className="h-4 w-4 mr-2" />
                              Subir Avatar
                            </>
                          )}
                       </Button>
                       <p className="text-xs text-muted-foreground">
                         Tu foto de perfil personal
                       </p>
                     </div>
                     <input
                       ref={avatarInputRef}
                       type="file"
                       accept="image/*"
                       onChange={handleUserAvatarUpload}
                       className="hidden"
                     />
                   </div>
                 </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                  <>
                      <Save className="h-4 w-4 mr-2" />
                      {t.save}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

           {/* Plan y Uso */}
           <div className="space-y-6">
             {/* Plan Actual */}
             <Card>
               <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Crown className="h-5 w-5" />
                 {t.currentPlan}
               </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-medium">Plan:</span>
                     <Badge className={getPlanColor(profile.plan || 'free')}>
                       {profile.plan === 'free' ? 'Gratuito' : 
                        profile.plan === 'premium' ? 'Premium' : 
                        profile.plan === 'enterprise' ? 'Enterprise' : 'Gratuito'}
                     </Badge>
                   </div>
                   
                   <div className="space-y-2">
                     <div className="flex items-center justify-between text-sm">
                       <span>{t.usage}:</span>
                       <span className="font-medium">
                         {profile.usage_count || 0} / {profile.monthly_limit || 5} propiedades
                       </span>
                     </div>
                     <Progress value={usagePercentage} className="h-2" />
                     {usagePercentage >= 80 && (
                       <p className="text-xs text-amber-600">
                         ⚠️ Te estás acercando a tu límite mensual
                       </p>
                     )}
                   </div>

                   {profile.plan === 'free' && (
                     <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                       <div className="flex items-start gap-3">
                         <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                         <div>
                           <h4 className="font-medium text-sm mb-1">Upgrade a Premium</h4>
                           <p className="text-xs text-muted-foreground mb-3">
                             Obtén acceso ilimitado a todas las funciones
                           </p>
                           <Button size="sm" className="bg-gradient-hero hover:shadow-glow transition-all" asChild>
                             <Link to="/plans">
                               <CreditCard className="h-4 w-4 mr-2" />
                               {t.upgradeNow}
                             </Link>
                           </Button>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               </CardContent>
             </Card>

              {/* Estadísticas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Estadísticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Propiedades procesadas</span>
                      </div>
                      <span className="font-bold text-lg">{profile.usage_count || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Miembro desde</span>
                      </div>
                      <span className="text-sm font-medium">
                        {new Date(profile.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Banner de Marketing */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-primary">
                      Impulsa tu marca inmobiliaria al siguiente nivel
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Estrategias de marketing digital, diseño de alto impacto, desarrollo web a medida y automatizaciones inteligentes, exclusivas para Realtors de alto rendimiento.
                    </p>
                    <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border border-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        📩 Contáctanos en{" "}
                        <a 
                          href="mailto:contacto@tuempresa.com" 
                          className="text-primary hover:underline"
                        >
                          contacto@tuempresa.com
                        </a>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
           </div>
        </div>

          {/* Conexiones de Redes Sociales */}
          <SocialMediaConnections 
            profile={profile} 
            onUpdate={refreshProfile} 
          />
        </div>
      </div>
    </AppLayout>
  );
}