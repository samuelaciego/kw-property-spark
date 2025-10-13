import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/app-layout";
import { SocialMediaPreview } from "@/components/social-media-preview";
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
  id?: string;
  title: string;
  description: string;
  price: string;
  address: string;
  images: string[];
  facebook_content?: string;
  instagram_content?: string;
  generated_image_instagram?: string;
  generated_image_facebook?: string;
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
  const [publicationType, setPublicationType] = useState("en-venta");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: true,
    instagram: true
  });
  const [generatingImages, setGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{
    instagram?: string;
    facebook?: string;
  }>({});

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

      // Step 4: Generate AI content for all platforms
      setProgress(80);
      
      const propertyForAI = {
        title: extractedData.title,
        description: extractedData.description,
        price: extractedData.price,
        address: extractedData.address
      };

      // Generate content for Facebook and Instagram in parallel
      const [facebookResult, instagramResult] = await Promise.all([
        supabase.functions.invoke('generate-social-content', {
          body: { platform: 'facebook', propertyData: propertyForAI }
        }),
        supabase.functions.invoke('generate-social-content', {
          body: { platform: 'instagram', propertyData: propertyForAI }
        })
      ]);

      // Step 5: Finalize
      setProgress(100);

      // Save to database with AI-generated content
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
        facebook_content: facebookResult.data?.generatedContent || null,
        instagram_content: instagramResult.data?.generatedContent || null,
        hashtags: ["#CasaEnVenta", "#KellerWilliams", "#BienesRaices"],
        status: "processed"
      };

      const { data: insertedProperty, error: insertError } = await supabase
        .from('properties')
        .insert([newProperty])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }
      
      // Update user usage count
      await supabase
        .from('profiles')
        .update({ usage_count: profile.usage_count + 1 })
        .eq('user_id', profile.user_id);
      
      await refreshProfile();

      // Generate social images automatically
      try {
        const { data: imagesData, error: imagesError } = await supabase.functions.invoke('generate-social-images', {
          body: { propertyId: insertedProperty.id }
        });

        if (imagesError) {
          console.error('Error invoking generate-social-images:', imagesError);
          toast({
            title: "Error al generar imágenes",
            description: imagesError.message || "No se pudieron generar las imágenes con Cloudflare",
            variant: "destructive",
          });
        } else if (!imagesData.success) {
          console.error('Image generation failed:', imagesData.error);
          toast({
            title: "Error al generar imágenes",
            description: imagesData.error || "No se pudieron generar las imágenes con Cloudflare. Verifica la configuración de Cloudflare API.",
            variant: "destructive",
          });
        } else {
          setGeneratedImages({
            instagram: imagesData.images.instagram,
            facebook: imagesData.images.facebook
          });
          
          // Set property data with all the data including generated images
          setPropertyData({
            ...extractedData,
            id: insertedProperty.id,
            facebook_content: insertedProperty.facebook_content,
            instagram_content: insertedProperty.instagram_content,
            generated_image_instagram: imagesData.images.instagram,
            generated_image_facebook: imagesData.images.facebook
          });
          
          toast({
            title: "Imágenes generadas",
            description: "Las imágenes se generaron correctamente con Cloudflare",
          });
        }
        
        // Set property data even if image generation fails
        if (!imagesData?.success) {
          setPropertyData({
            ...extractedData,
            id: insertedProperty.id,
            facebook_content: insertedProperty.facebook_content,
            instagram_content: insertedProperty.instagram_content,
          });
        }
      } catch (imgError) {
        console.error('Error generating images:', imgError);
        toast({
          title: "Error al generar imágenes",
          description: "Ocurrió un error inesperado al generar las imágenes",
          variant: "destructive",
        });
        // Still set property data even if image generation fails
        setPropertyData({
          ...extractedData,
          id: insertedProperty.id,
          facebook_content: insertedProperty.facebook_content,
          instagram_content: insertedProperty.instagram_content,
        });
      }

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

  const handleGenerateImages = async () => {
    if (!propertyData?.id) {
      toast({
        title: "Error",
        description: "No hay una propiedad procesada para generar imágenes.",
        variant: "destructive"
      });
      return;
    }

    setGeneratingImages(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-social-images', {
        body: { propertyId: propertyData.id }
      });

      if (error) throw error;

      if (data.success) {
        setGeneratedImages(data.images);
        setPropertyData(prev => prev ? {
          ...prev,
          generated_image_instagram: data.images.instagram,
          generated_image_facebook: data.images.facebook
        } : null);

        toast({
          title: "¡Imágenes generadas!",
          description: "Las imágenes profesionales han sido creadas exitosamente."
        });
      }
    } catch (error: any) {
      console.error('Error generating images:', error);
      toast({
        title: "Error al generar imágenes",
        description: error.message || "No se pudieron generar las imágenes",
        variant: "destructive"
      });
    } finally {
      setGeneratingImages(false);
    }
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

                {/* Publication Type */}
                <div className="space-y-3">
                  <Label>Tipo de publicación</Label>
                  <RadioGroup 
                    value={publicationType} 
                    onValueChange={setPublicationType}
                    disabled={processing}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="en-venta" id="en-venta" />
                      <Label htmlFor="en-venta" className="font-normal cursor-pointer">
                        En venta
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="open-house" id="open-house" />
                      <Label htmlFor="open-house" className="font-normal cursor-pointer">
                        Open House
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vendida" id="vendida" />
                      <Label htmlFor="vendida" className="font-normal cursor-pointer">
                        Vendida
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Social Media Platforms */}
                <div className="space-y-3">
                  <Label>Redes sociales</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="facebook"
                        checked={selectedPlatforms.facebook}
                        onCheckedChange={(checked) => 
                          setSelectedPlatforms(prev => ({ ...prev, facebook: checked as boolean }))
                        }
                        disabled={processing}
                      />
                      <Label htmlFor="facebook" className="font-normal cursor-pointer">
                        Facebook
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="instagram"
                        checked={selectedPlatforms.instagram}
                        onCheckedChange={(checked) => 
                          setSelectedPlatforms(prev => ({ ...prev, instagram: checked as boolean }))
                        }
                        disabled={processing}
                      />
                      <Label htmlFor="instagram" className="font-normal cursor-pointer">
                        Instagram
                      </Label>
                    </div>
                  </div>
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
                      {progress >= 80 && "Generando imágenes profesionales..."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section - Only show final consolidated view */}
            {propertyData && !processing && (
              <div className="space-y-6">
                {/* Success Header */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      <div>
                        <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">
                          ¡Propiedad Procesada!
                        </h3>
                        <p className="text-green-700 dark:text-green-300">
                          Contenido listo para compartir en redes sociales
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media Previews */}
                <div className="space-y-4">
                  {selectedPlatforms.instagram && (
                    <SocialMediaPreview
                      platform="instagram"
                      imageUrl={propertyData.generated_image_instagram}
                      content={propertyData.instagram_content || ''}
                      isConnected={!!(profile as any)?.instagram_connected}
                      onPublish={() => {}}
                      isPublishing={false}
                    />
                  )}

                  {selectedPlatforms.facebook && (
                    <SocialMediaPreview
                      platform="facebook"
                      imageUrl={propertyData.generated_image_facebook}
                      content={propertyData.facebook_content || ''}
                      isConnected={!!(profile as any)?.facebook_connected}
                      onPublish={() => {}}
                      isPublishing={false}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}