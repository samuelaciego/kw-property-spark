import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import heroImage from "@/assets/hero-bg.jpg";

export function HeroSection() {
  const { user } = useAuth();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Luxury Real Estate" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Exclusivo para Agentes de Keller Williams</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            Automatiza el Marketing de{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              tus Propiedades
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Extrae datos de propiedades automáticamente y genera contenido profesional para redes sociales en segundos.
          </p>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center text-muted-foreground">
              <Zap className="h-5 w-5 text-primary mr-2" />
              <span>Extracción Automática</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Sparkles className="h-5 w-5 text-accent mr-2" />
              <span>Contenido IA</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Play className="h-5 w-5 text-warning mr-2" />
              <span>Videos Automáticos</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <Button 
              size="lg" 
              className="bg-gradient-hero hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
              asChild
            >
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Ir al Dashboard" : "Comenzar Prueba Gratuita"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 hover:bg-muted/50 transition-all duration-300"
              asChild
            >
              <Link to={user ? "/process" : "/auth"}>
                <Play className="mr-2 h-5 w-5" />
                {user ? "Procesar Propiedades" : "Ver Demo"}
              </Link>
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <p className="text-sm text-muted-foreground mb-4">Confiado por más de 1,000+ agentes inmobiliarios</p>
            <div className="flex justify-center">
              <div className="bg-gradient-card p-4 rounded-lg shadow-card">
                <span className="text-2xl font-bold text-primary">Keller Williams</span>
                <span className="text-muted-foreground ml-2">Partner Oficial</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }}></div>
    </section>
  );
}