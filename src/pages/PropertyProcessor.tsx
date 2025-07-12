import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

  const handleProcess = async () => {
    if (!url.trim()) return;
    
    setProcessing(true);
    setProgress(0);
    
    // Simular proceso de extracción
    const steps = [
      { message: "Validando URL...", progress: 20 },
      { message: "Extrayendo datos de la propiedad...", progress: 40 },
      { message: "Analizando imágenes...", progress: 60 },
      { message: "Generando contenido...", progress: 80 },
      { message: "Finalizando proceso...", progress: 100 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(step.progress);
    }

    // Datos simulados
    setPropertyData({
      title: "Casa Moderna con Vista Panorámica",
      description: "Hermosa casa de 3 habitaciones y 2.5 baños con acabados de lujo, cocina gourmet y vista espectacular a las montañas. Perfecta para familias que buscan comodidad y elegancia.",
      price: "$750,000",
      address: "123 Mountain View Drive, Austin, TX 78701",
      images: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300", 
        "/api/placeholder/400/300"
      ],
      agent: {
        name: "María González",
        phone: "(555) 123-4567",
        email: "maria.gonzalez@kw.com"
      }
    });

    setGeneratedContent({
      socialText: "🏡 ¡NUEVA PROPIEDAD DISPONIBLE! Esta espectacular casa moderna te espera con vistas panorámicas increíbles. 3 habitaciones, 2.5 baños y acabados de primera calidad. ¡No dejes pasar esta oportunidad única!",
      hashtags: ["#CasaEnVenta", "#Austin", "#KellerWilliams", "#BienesRaices", "#PropiedadDeLujo", "#VistaPanoramica"],
      images: [
        "/api/placeholder/400/400",
        "/api/placeholder/400/400"
      ],
      videoUrl: "/api/placeholder/video"
    });

    setProcessing(false);
  };

  return (
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
                          {propertyData.agent.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{propertyData.agent.phone}</p>
                        <p className="text-sm text-muted-foreground">{propertyData.agent.email}</p>
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
                      <div key={index} className="aspect-video bg-muted rounded-lg border border-border/50"></div>
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
                        <div className="aspect-square bg-muted rounded-lg border border-border/50"></div>
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
  );
}