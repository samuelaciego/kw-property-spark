
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  BarChart3,
  Home,
  Image,
  Video,
  TrendingUp,
  Loader2
} from "lucide-react";

interface Property {
  id: string;
  title: string | null;
  address: string | null;
  price: string | null;
  status: string | null;
  created_at: string;
  images: string[] | null;
  views: number | null;
}

export default function Dashboard() {
  const { profile, user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadProperties();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading properties for user:', user?.id);
      
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('id, title, address, price, status, created_at, images, views')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('Error loading properties:', fetchError);
        setError('Error cargando propiedades: ' + fetchError.message);
        return;
      }
      
      console.log('Properties loaded:', data);
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      setError('Error inesperado al cargar propiedades');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show error if there's an error
  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadProperties}>Reintentar</Button>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  const currentMonth = profile?.usage_count || 0;
  const monthlyLimit = profile?.monthly_limit || 5;
  const usagePercentage = Math.min((currentMonth / monthlyLimit) * 100, 100);

  const filteredProperties = properties.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Gestiona tus propiedades y contenido</p>
              </div>
              <Button className="bg-gradient-hero hover:shadow-glow transition-all duration-300" asChild>
                <Link to="/process">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Propiedad
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Este Mes</p>
                    <p className="text-2xl font-bold text-foreground">{currentMonth}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Progress value={usagePercentage} className="mt-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.max(0, monthlyLimit - currentMonth)} restantes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Propiedades</p>
                    <p className="text-2xl font-bold text-foreground">{properties.length}</p>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <Image className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Total procesadas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Imágenes</p>
                    <p className="text-2xl font-bold text-foreground">
                      {properties.reduce((sum, p) => sum + (p.images?.length || 0), 0)}
                    </p>
                  </div>
                  <div className="bg-warning/10 p-3 rounded-lg">
                    <Video className="h-6 w-6 text-warning" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Total procesadas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="text-2xl font-bold text-foreground capitalize">
                      {profile?.plan || 'Free'}
                    </p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Plan actual</p>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar propiedades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Properties Table */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Propiedades Recientes
              </CardTitle>
              <CardDescription>
                Historial de propiedades procesadas y su estado actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Cargando propiedades...</span>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    {properties.length === 0 
                      ? "No hay propiedades procesadas aún." 
                      : "No se encontraron propiedades con ese criterio de búsqueda."
                    }
                  </p>
                  {properties.length === 0 && (
                    <Button asChild>
                      <Link to="/process">Procesar Primera Propiedad</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProperties.slice(0, 10).map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {property.title || 'Sin título'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {property.address || 'Sin dirección'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm font-medium text-primary">
                            {property.price || 'Precio no disponible'}
                          </span>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(property.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Eye className="h-3 w-3 mr-1" />
                            {property.views || 0} vistas
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Image className="h-3 w-3 mr-1" />
                            {property.images?.length || 0}
                          </div>
                        </div>

                        <Badge 
                          variant={property.status === 'processed' ? 'default' : 'secondary'}
                          className={property.status === 'processed' ? 'bg-accent' : ''}
                        >
                          {property.status === 'processed' ? 'Procesado' : property.status || 'Pendiente'}
                        </Badge>

                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            asChild
                          >
                            <Link to={`/property/${property.id}`} title="Ver propiedad">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Crear contenido para descargar
                              const content = `
Título: ${property.title || 'Sin título'}
Dirección: ${property.address || 'Sin dirección'}
Precio: ${property.price || 'No especificado'}
Estado: ${property.status || 'Pendiente'}
Fecha: ${new Date(property.created_at).toLocaleDateString()}
Imágenes: ${property.images?.length || 0}
                              `.trim();
                              
                              const blob = new Blob([content], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `propiedad-${property.title?.replace(/\s+/g, '-') || property.id}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }}
                            title="Descargar información"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
