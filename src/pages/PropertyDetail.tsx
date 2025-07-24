import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, DollarSign, Calendar, Eye } from "lucide-react";
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
  social_content: string | null;
  hashtags: string[] | null;
  agent_name: string | null;
  agent_phone: string | null;
}
const PropertyDetail = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{property.title || "Propiedad sin título"}</span>
              
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {property.images && property.images.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.images.map((image, index) => <img key={index} src={image} alt={`Imagen ${index + 1}`} className="rounded-lg object-cover w-full h-48" />)}
              </div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información de la Propiedad</h3>
                
                {property.address && <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Dirección</p>
                      <p className="text-muted-foreground">{property.address}</p>
                    </div>
                  </div>}

                {property.price && <div className="flex items-start gap-2">
                    <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Precio</p>
                      <p className="text-muted-foreground">{property.price}</p>
                    </div>
                  </div>}

                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Fecha de creación</p>
                    <p className="text-muted-foreground">
                      {new Date(property.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                {property.description && <div>
                    <p className="font-medium mb-2">Descripción</p>
                    <p className="text-muted-foreground">{property.description}</p>
                  </div>}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información del Agente</h3>
                
                {property.agent_name && <div>
                    <p className="font-medium">Nombre del Agente</p>
                    <p className="text-muted-foreground">{property.agent_name}</p>
                  </div>}

                {property.agent_phone && <div>
                    <p className="font-medium">Teléfono</p>
                    <p className="text-muted-foreground">{property.agent_phone}</p>
                  </div>}
              </div>
            </div>

            {property.social_content && <div>
                <h3 className="text-lg font-semibold mb-2">Contenido para Redes Sociales</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{property.social_content}</p>
                </div>
              </div>}

            {property.hashtags && property.hashtags.length > 0 && <div>
                <h3 className="text-lg font-semibold mb-2">Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {property.hashtags.map((hashtag, index) => <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                      #{hashtag}
                    </span>)}
                </div>
              </div>}
          </CardContent>
        </Card>
      </div>
    </AppLayout>;
};
export default PropertyDetail;