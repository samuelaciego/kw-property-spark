import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Link, 
  Image, 
  FileText, 
  Video, 
  BarChart3, 
  Shield, 
  Zap, 
  Sparkles,
  ArrowRight 
} from "lucide-react";

const features = [
  {
    icon: Link,
    title: "Extracción Automática",
    description: "Ingresa cualquier enlace de propiedad de KW y extrae automáticamente título, descripción, precio, dirección, imágenes y datos del agente.",
    color: "text-primary"
  },
  {
    icon: Image,
    title: "Imágenes para Redes",
    description: "Genera automáticamente imágenes profesionales para Instagram y Facebook con el branding personalizado del agente.",
    color: "text-accent"
  },
  {
    icon: FileText,
    title: "Contenido Optimizado",
    description: "Crea textos con hashtags relevantes y llamadas a la acción efectivas para maximizar el engagement.",
    color: "text-warning"
  },
  {
    icon: Video,
    title: "Videos Automáticos",
    description: "Produce videos cortos profesionales combinando las fotos de la propiedad con texto persuasivo.",
    color: "text-primary"
  },
  {
    icon: BarChart3,
    title: "Panel de Control",
    description: "Accede a un historial completo de todas las propiedades procesadas y métricas de rendimiento.",
    color: "text-accent"
  },
  {
    icon: Shield,
    title: "Seguro y Confiable",
    description: "Autenticación con Google OAuth 2.0 y almacenamiento seguro en la nube con respaldos automáticos.",
    color: "text-warning"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Características Principales</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Todo lo que necesitas para{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              destacar
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Una solución completa que automatiza todo tu flujo de trabajo de marketing inmobiliario, 
            desde la extracción de datos hasta la generación de contenido profesional.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-border/50"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-current/10 to-current/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <div className="bg-gradient-card rounded-2xl p-8 border border-border/50 shadow-card">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Proceso Simple en 3 Pasos
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Link className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">1. Pega el Enlace</h4>
              <p className="text-muted-foreground">Copia y pega cualquier URL de propiedad de Keller Williams</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">2. Procesamiento IA</h4>
              <p className="text-muted-foreground">Nuestro sistema extrae y procesa toda la información automáticamente</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">3. Contenido Listo</h4>
              <p className="text-muted-foreground">Descarga imágenes, videos y textos optimizados para redes sociales</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-hero hover:shadow-glow transition-all duration-300 text-lg px-8"
          >
            Probar Características
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}