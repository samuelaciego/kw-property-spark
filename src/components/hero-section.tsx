import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { VideoLightbox } from "@/components/ui/video-lightbox";
import { useState } from "react";
import heroImage from "@/assets/hero-bg.jpg";
export function HeroSection() {
  const {
    user
  } = useAuth();
  const {
    t
  } = useLanguage();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Luxury Real Estate" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">{t.exclusiveForKW}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            {t.automatePropertyMarketing}{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {t.yourProperties}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up" style={{
          animationDelay: "0.2s"
        }}>
            {t.heroSubtitle}
          </p>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-slide-up" style={{
          animationDelay: "0.4s"
        }}>
            <div className="flex items-center text-muted-foreground">
              <Zap className="h-5 w-5 text-primary mr-2" />
              <span>{t.automaticExtraction}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Sparkles className="h-5 w-5 text-accent mr-2" />
              <span>{t.aiContent}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Play className="h-5 w-5 text-warning mr-2" />
              <span>{t.automaticVideos}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{
          animationDelay: "0.6s"
        }}>
            <Button size="lg" className="bg-gradient-hero hover:shadow-glow transition-all duration-300 text-lg px-8 py-6" asChild>
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? t.goToDashboard : t.startFreeTrial}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover:bg-muted/50 transition-all duration-300" onClick={() => setIsVideoOpen(true)}>
              <Play className="mr-2 h-5 w-5" />
              {t.seeDemo}
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="mt-12 text-center animate-fade-in" style={{
          animationDelay: "0.8s"
        }}>
            
            
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse" style={{
      animationDelay: "1s"
    }}></div>
      
      {/* Video Lightbox */}
      <VideoLightbox isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} videoId="dQw4w9WgXcQ" title="PropGen Demo" />
    </section>;
}