import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Link, 
  Image, 
  FileText, 
  Mail, 
  BarChart3, 
  Shield, 
  Zap, 
  Sparkles,
  ArrowRight 
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function FeaturesSection() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Link,
      title: t.automaticExtractionTitle,
      description: t.automaticExtractionDesc,
      color: "text-primary"
    },
    {
      icon: Image,
      title: t.socialImages,
      description: t.socialImagesDesc,
      color: "text-accent"
    },
    {
      icon: FileText,
      title: t.optimizedContent,
      description: t.optimizedContentDesc,
      color: "text-warning"
    },
    {
      icon: FileText,
      title: t.printedMaterialsTitle,
      description: t.printedMaterialsDesc,
      color: "text-primary"
    },
    {
      icon: Mail,
      title: t.emailSignaturesTitle,
      description: t.emailSignaturesDesc,
      color: "text-accent"
    },
    {
      icon: BarChart3,
      title: t.controlPanel,
      description: t.controlPanelDesc,
      color: "text-accent"
    },
    {
      icon: Shield,
      title: t.secureReliable,
      description: t.secureReliableDesc,
      color: "text-warning"
    }
  ];
  
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 rounded-full mb-4 sm:mb-6">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary mr-2" />
            <span className="text-xs sm:text-sm font-medium text-primary">{t.mainFeatures}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-4">
            {t.everythingYouNeed}{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {t.toStandOut}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            {t.featuresDescription}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 lg:mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 bg-gradient-card border-border/50"
            >
              <CardHeader className="pb-3 sm:pb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-current/10 to-current/5 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                  <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <div className="bg-gradient-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-border/50 shadow-card">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-foreground mb-6 sm:mb-8 px-4">
            {t.simpleProcess}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 lg:gap-8">
            <div className="text-center px-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Link className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2">{t.pasteLink}</h4>
              <p className="text-sm sm:text-base text-muted-foreground">{t.pasteLinkDesc}</p>
            </div>
            <div className="text-center px-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2">{t.aiProcessing}</h4>
              <p className="text-sm sm:text-base text-muted-foreground">{t.aiProcessingDesc}</p>
            </div>
            <div className="text-center px-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2">{t.readyContent}</h4>
              <p className="text-sm sm:text-base text-muted-foreground">{t.readyContentDesc}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-10 lg:mt-12 px-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-gradient-hero hover:shadow-glow transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 min-h-[48px]"
          >
            {t.tryFeatures}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}