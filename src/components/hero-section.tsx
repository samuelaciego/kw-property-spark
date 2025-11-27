import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Mail, Sparkles, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import heroImage from "@/assets/hero-bg.jpg";

export function HeroSection() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 pt-16 md:pt-20"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white mr-2 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-white">{t.exclusiveForKW}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight px-2">
            {t.automatePropertyMarketing}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.yourProperties}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
            {t.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-4 sm:pt-8 px-4">
            <Link to={user ? "/dashboard" : "/auth"} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-hero hover:shadow-glow transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 group min-h-[48px]"
              >
                {user ? t.goToDashboard : t.startFreeTrial}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 min-h-[48px]"
              >
                {t.features}
              </Button>
            </a>
          </div>

          {/* Social Proof */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-12 text-white/80 px-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-hero border-2 border-white" />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-medium">{t.trustedBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs sm:text-sm font-medium">{t.officialPartner}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
