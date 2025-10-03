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
import { SocialMediaPublisher } from "@/components/social-media-publisher";
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
  tiktok_content?: string;
  generated_image_facebook?: string;
  generated_image_instagram?: string;
  generated_image_stories?: string;
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
    instagram: true,
    tiktok: true
  });

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
      setProgress(70);
      
      const propertyForAI = {
        title: extractedData.title,
        description: extractedData.description,
        price: extractedData.price,
        address: extractedData.address
      };

      // Generate content for all three platforms in parallel
      const [facebookResult, instagramResult, tiktokResult] = await Promise.all([
        supabase.functions.invoke('generate-social-content', {
          body: { platform: 'facebook', propertyData: propertyForAI }
        }),
        supabase.functions.invoke('generate-social-content', {
          body: { platform: 'instagram', propertyData: propertyForAI }
        }),
        supabase.functions.invoke('generate-social-content', {
          body: { platform: 'tiktok', propertyData: propertyForAI }
        })
      ]);

      const facebookContent = facebookResult.data?.generatedContent || null;
      const instagramContent = instagramResult.data?.generatedContent || null;
      const tiktokContent = tiktokResult.data?.generatedContent || null;

      // Step 5: Generate social media images
      setProgress(85);
      console.log('Generating social media images...');

      let imageUrls = {
        facebook: null,
        instagram: null,
        stories: null
      };

      // Only generate images if we have at least 3 property images
      if (extractedData.images && extractedData.images.length >= 3) {
        try {
          const tempPropertyId = crypto.randomUUID();
          
          const { data: imageData, error: imageError } = await supabase.functions.invoke(
            'generate-property-images',
            {
              body: {
                propertyData: {
                  price: extractedData.price,
                  address: extractedData.address,
                  bedrooms: extractedData.bedrooms || 'N/A',
                  bathrooms: extractedData.bathrooms || 'N/A',
                },
                images: extractedData.images.slice(0, 3),
                userId: profile.user_id,
                propertyId: tempPropertyId
              }
            }
          );

          if (imageError) {
            console.error('Error generating images:', imageError);
          } else if (imageData) {
            imageUrls = imageData;
            console.log('Images generated successfully:', imageUrls);
          }
        } catch (err) {
          console.error('Exception generating images:', err);
          // No bloqueamos el proceso si falla la generación de imágenes
        }
      } else {
        console.log('Not enough images to generate social media graphics (need at least 3)');
      }

      // Step 6: Finalize
      setProgress(100);

      console.log('Saving to database...');

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
        facebook_content: facebookContent,
        instagram_content: instagramContent,
        tiktok_content: tiktokContent,
        generated_image_facebook: imageUrls.facebook,
        generated_image_instagram: imageUrls.instagram,
        generated_image_stories: imageUrls.stories,
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

      // Set property data with the inserted property ID
      setPropertyData({
        ...extractedData,
        id: insertedProperty.id,
        facebook_content: insertedProperty.facebook_content,
        instagram_content: insertedProperty.instagram_content,
        tiktok_content: insertedProperty.tiktok_content,
        generated_image_facebook: insertedProperty.generated_image_facebook,
        generated_image_instagram: insertedProperty.generated_image_instagram,
        generated_image_stories: insertedProperty.generated_image_stories
      });

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
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="tiktok"
                        checked={selectedPlatforms.tiktok}
                        onCheckedChange={(checked) => 
                          setSelectedPlatforms(prev => ({ ...prev, tiktok: checked as boolean }))
                        }
                        disabled={processing}
                      />
                      <Label htmlFor="tiktok" className="font-normal cursor-pointer">
                        TikTok
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
                      {progress >= 60 && progress < 70 && "Generando contenido..."}
                      {progress >= 70 && progress < 85 && "Generando contenido AI..."}
                      {progress >= 85 && progress < 100 && "Generando imágenes para redes sociales..."}
                      {progress >= 100 && "Finalizando proceso..."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Data and Generated Content sections are hidden to show only Social Media Publisher */}

            {/* Social Media Publisher */}
            {propertyData && profile && (
              <SocialMediaPublisher 
                propertyData={{
                  id: propertyData.id || url,
                  title: propertyData.title,
                  description: propertyData.description,
                  price: propertyData.price,
                  address: propertyData.address,
                  images: propertyData.images,
                  facebook_content: propertyData.facebook_content || '',
                  instagram_content: propertyData.instagram_content || '',
                  tiktok_content: propertyData.tiktok_content || '',
                  generated_image_facebook: propertyData.generated_image_facebook,
                  generated_image_instagram: propertyData.generated_image_instagram,
                  generated_image_stories: propertyData.generated_image_stories,
                  hashtags: [],
                  agent_name: profile?.full_name || null,
                  agent_phone: (profile as any)?.phone || null
                }} 
                profile={profile} 
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}