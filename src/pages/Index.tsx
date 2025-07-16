import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { PricingSection } from "@/components/pricing-section";
import { Footer } from "@/components/footer";
import { LanguageSelector } from "@/components/ui/language-selector";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <LanguageSelector />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
