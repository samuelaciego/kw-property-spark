import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function PricingSection() {
  const { t } = useLanguage();
  
  const plans = [
    {
      name: t.basic,
      price: "$29",
      period: t.perMonth,
      description: t.basicDesc,
      icon: Zap,
      features: [
        "50 propiedades por mes",
        "Imágenes para redes sociales",
        "Textos básicos con hashtags",
        "Soporte por email",
        "Historial de 30 días"
      ],
      buttonText: t.startBasic,
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: t.professional,
      price: "$79",
      period: t.perMonth,
      description: t.professionalDesc,
      icon: Star,
      features: [
        "200 propiedades por mes",
        "Imágenes profesionales",
        "Material impreso y firmas",
        "Contenido optimizado con IA",
        "Branding personalizado",
        "Soporte prioritario",
        "Historial ilimitado",
        "Analytics avanzados"
      ],
      buttonText: t.startProfessional,
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: t.enterprise,
      price: "$199",
      period: t.perMonth,
      description: t.enterpriseDesc,
      icon: Crown,
      features: [
        "Propiedades ilimitadas",
        "Todo del plan Profesional",
        "Múltiples usuarios",
        "Plantillas personalizadas",
        "API para integraciones",
        "Gerente de cuenta dedicado",
        "Capacitación personalizada"
      ],
      buttonText: t.contactSales,
      buttonVariant: "outline" as const,
      popular: false
    }
  ];
  
  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 rounded-full mb-4 sm:mb-6">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-primary mr-2" />
            <span className="text-xs sm:text-sm font-medium text-primary">{t.plansAndPricing}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-4">
            {t.choosePerfectPlan}{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {t.forYourBusiness}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            {t.pricingDescription}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-10 sm:mb-12 lg:mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-primary shadow-glow bg-gradient-card' 
                  : 'bg-gradient-card border-border/50'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2.5 sm:-top-3 left-1/2 transform -translate-x-1/2 bg-gradient-hero text-white px-3 py-0.5 sm:px-4 sm:py-1 text-xs sm:text-sm">
                  {t.mostPopular}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r mx-auto mb-3 sm:mb-4 flex items-center justify-center ${
                  plan.popular 
                    ? 'from-primary to-primary-glow' 
                    : 'from-muted to-muted/50'
                }`}>
                  <plan.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${plan.popular ? 'text-white' : 'text-primary'}`} />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground px-2">
                  {plan.description}
                </CardDescription>
                <div className="mt-3 sm:mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm sm:text-base text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 px-4 sm:px-6">
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant}
                  size="lg" 
                  className={`w-full min-h-[48px] text-sm sm:text-base ${
                    plan.popular 
                      ? 'bg-gradient-hero hover:shadow-glow' 
                      : ''
                  } transition-all duration-300`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-border/50 shadow-card max-w-4xl mx-auto">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-foreground mb-6 sm:mb-8 px-4">
            {t.frequentQuestions}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            <div className="p-2">
              <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">¿Hay período de prueba?</h4>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Sí, todos los planes incluyen 14 días de prueba gratuita sin necesidad de tarjeta de crédito.
              </p>
            </div>
            <div className="p-2">
              <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">¿Puedo cambiar de plan?</h4>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Absolutamente. Puedes actualizar o degradar tu plan en cualquier momento desde tu panel de control.
              </p>
            </div>
            <div className="p-2">
              <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">¿Qué métodos de pago aceptan?</h4>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Aceptamos todas las tarjetas de crédito principales a través de Stripe, nuestro procesador seguro de pagos.
              </p>
            </div>
            <div className="p-2">
              <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">¿Hay descuentos anuales?</h4>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Sí, obtén 2 meses gratis al pagar anualmente. Contáctanos para más detalles sobre precios anuales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}