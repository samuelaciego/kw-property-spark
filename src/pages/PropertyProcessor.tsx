import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  Link, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Download,
  Image,
  Video,
  FileText,
  Sparkles,
  Home,
  MapPin,
  DollarSign,
  User
} from "lucide-react";

interface PropertyData {
  title: string;
  description: string;
  price: string;
  address: string;
  images: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function PropertyProcessor() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{
    socialText: string;
    hashtags: string[];
    images: string[];
    videoUrl?: string;
  } | null>(null);

  const isValidKWUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      
      console.log('Validating URL:', url, 'Hostname:', hostname);
      
      // Check if it's kw.com or any subdomain of kw.com
      const isValid = hostname === 'kw.com' || hostname.endsWith('.kw.com');
      console.log('Is valid KW domain:', isValid);
      
      return isValid;
    } catch (error) {
      console.log('URL parsing error:', error);
      return false;
    }
  };

  const handleProcess = async () => {
    console.log('handleProcess called with URL:', url);
    
    if (!url.trim()) {
      console.log('Empty URL, returning');
      return;
    }
    
    // Validate that URL is from kw.com domain
    const isValid = isValidKWUrl(url);
    console.log('URL validation result:', isValid, 'for URL:', url);
    
    if (!isValid) {
      console.log('Invalid KW URL detected');
      toast({
        title: "URL no válida",
        description: "Solo se permiten enlaces de propiedades de Keller Williams (*.kw.com)",
        variant: "destructive",
      });
      return;
    }
    
    if (!profile || profile.usage_count >= profile.monthly_limit) {
      toast({
        title: "Límite alcanzado",
        description: `Has alcanzado el límite de ${profile?.monthly_limit || 5} propiedades de tu plan.`,
        variant: "destructive",
      });
      return;
    }
    
    setProcessing(true);
    setProgress(0);
    
    // Proceso real de extracción
    const steps = [
      { message: "Validando URL...", progress: 20 },
      { message: "Extrayendo datos de la propiedad...", progress: 40 },
      { message: "Analizando imágenes...", progress: 60 },
      { message: "Generando contenido...", progress: 80 },
      { message: "Finalizando proceso...", progress: 100 }
    ];

    try {
      // Step 1: Validation
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Extract property data
      setProgress(40);
      console.log('Calling extract-property function with URL:', url);
      const { data: propertyResult, error: propertyError } = await supabase.functions.invoke('extract-property', {
        body: { url }
      });
      
      console.log('Extract property response:', { propertyResult, propertyError });

      // Handle error case properly - check if propertyError exists and has details
      if (propertyError) {
        console.log('Function error details:', propertyError);
        
        // Try to extract error details from the error object
        let errorMessage = 'Error al extraer datos de la propiedad';
        
        if (propertyError.message) {
          errorMessage = propertyError.message;
        }
        
        // If the error has context or details, use them
        if (typeof propertyError.context === 'object' && propertyError.context?.error) {
          errorMessage = propertyError.context.error;
        }
        
        throw new Error(errorMessage);
      }

      // Also check if the response indicates failure
      if (propertyResult && !propertyResult.success) {
        throw new Error(propertyResult.error || 'No se pudieron extraer los datos');
      }

      // Check if we have valid data
      if (!propertyResult || !propertyResult.data) {
        throw new Error('No se recibieron datos válidos de la propiedad');
      }

      const extractedData = propertyResult.data;
      setPropertyData(extractedData);

      // Step 3: Analyzing images
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Generate content
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 5: Finalize
      setProgress(100);
      
      // Generate social media content based on extracted data
      const generatedContent = {
        socialText: `🏡 ¡NUEVA PROPIEDAD DISPONIBLE! ${extractedData.title} te espera con características increíbles. ${extractedData.description.substring(0, 100)}... ¡No dejes pasar esta oportunidad única!`,
        hashtags: ["#CasaEnVenta", "#KellerWilliams", "#BienesRaices", "#PropiedadDeLujo", "#Oportunidad"],
        images: extractedData.images.slice(0, 2), // Use first 2 extracted images
        videoUrl: "/api/placeholder/video"
      };

      // Save to database
      const newProperty = {
        user_id: profile.user_id,
        url,
        title: extractedData.title || "Propiedad sin título",
        description: extractedData.description,
        price: extractedData.price,
        address: extractedData.address,
        agent_name: profile.full_name || "Agente",
        agent_phone: (profile as any).phone || "",
        images: extractedData.images || [],
        social_content: generatedContent.socialText,
        hashtags: generatedContent.hashtags,
        status: "processed"
      };

      await supabase.from('properties').insert([newProperty]);
      
      // Update user usage count
      await supabase
        .from('profiles')
        .update({ usage_count: profile.usage_count + 1 })
        .eq('user_id', profile.user_id);
      
      await refreshProfile();
      setGeneratedContent(generatedContent);

      toast({
        title: "¡Propiedad procesada!",
        description: "El contenido ha sido generado exitosamente.",
      });
    } catch (extractError) {
      console.error('Error during extraction:', extractError);
      toast({
        title: "Error en extracción",
        description: extractError.message || "No se pudieron extraer los datos de la propiedad",
        variant: "destructive",
      });
      setProcessing(false);
      return;
    }

    setProcessing(false);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Procesar Propiedad</h1>
              <p className="text-muted-foreground">Extrae datos y genera contenido automáticamente</p>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* URL Input Section */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="h-5 w-5 mr-2" />
                  Enlace de Propiedad
                </CardTitle>
                <CardDescription>
                  Pega el enlace de cualquier propiedad de Keller Williams para comenzar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="property-url">URL de la Propiedad</Label>
                  <Input
                    id="property-url"
                    placeholder="https://www.kw.com/listing/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={processing}
                  />
                </div>
                <Button 
                  onClick={handleProcess}
                  disabled={!url.trim() || processing}
                  className="w-full bg-gradient-hero hover:shadow-glow transition-all duration-300"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Procesar Propiedad
                    </>
                  )}
                </Button>

                {processing && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">
                      {progress < 20 && "Validando URL..."}
                      {progress >= 20 && progress < 40 && "Extrayendo datos..."}
                      {progress >= 40 && progress < 60 && "Analizando imágenes..."}
                      {progress >= 60 && progress < 80 && "Generando contenido..."}
                      {progress >= 80 && "Finalizando proceso..."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Data */}
            {propertyData && (
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-accent" />
                    Datos Extraídos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Título</Label>
                        <p className="text-foreground font-medium">{propertyData.title}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Precio</Label>
                        <p className="text-2xl font-bold text-primary">{propertyData.price}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Dirección</Label>
                        <p className="text-muted-foreground flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {propertyData.address}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Agente</Label>
                        <div className="space-y-1">
                          <p className="text-foreground font-medium flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {profile?.full_name || "Agente"}
                          </p>
                          <p className="text-sm text-muted-foreground">{(profile as any)?.phone || "Teléfono no disponible"}</p>
                          <p className="text-sm text-muted-foreground">{profile?.email || "Email no disponible"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Descripción</Label>
                    <p className="text-muted-foreground mt-1">{propertyData.description}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Imágenes Originales ({propertyData.images.length})</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {propertyData.images.map((image, index) => (
                        <div key={index} className="aspect-video rounded-lg border border-border/50 overflow-hidden">
                          <img 
                            src={image} 
                            alt={`Imagen ${index + 1} de la propiedad`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80';
                            }}
                            onClick={() => window.open(image, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Content */}
            {generatedContent && (
              <div className="space-y-6">
                {/* Social Media Content */}
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Contenido para Redes Sociales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Texto Optimizado</Label>
                      <Textarea 
                        value={generatedContent.socialText}
                        readOnly
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Hashtags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {generatedContent.hashtags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Images */}
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Image className="h-5 w-5 mr-2" />
                      Imágenes Generadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {generatedContent.images.map((image, index) => (
                        <div key={index} className="space-y-2">
                          <div className="aspect-square rounded-lg border border-border/50 overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Imagen generada ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80';
                              }}
                              onClick={() => window.open(image, '_blank')}
                            />
                          </div>
                          <Button size="sm" variant="outline" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar {index === 0 ? 'Instagram' : 'Facebook'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Video */}
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Video className="h-5 w-5 mr-2" />
                      Video Generado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="aspect-video bg-muted rounded-lg border border-border/50 flex items-center justify-center">
                        <div className="text-center">
                          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Preview del video</p>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-hero">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Video (MP4)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}