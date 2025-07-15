import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/app-layout";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Building, 
  Mail, 
  Crown,
  Save,
  Loader2,
  CreditCard,
  TrendingUp
} from "lucide-react";

export default function Profile() {
  const { profile, user, refreshProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    company: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        company: profile.company || "",
      });
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
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Actualiza tu información de perfil
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
                  <Label htmlFor="full_name">Nombre Completo</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nombre de tu empresa"
                  />
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
                      Guardar Cambios
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
                  Plan Actual
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
                      <span>Uso mensual:</span>
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
                          <Button size="sm" className="bg-gradient-hero hover:shadow-glow transition-all">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Ver Planes
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}