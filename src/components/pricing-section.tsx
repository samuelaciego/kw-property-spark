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
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Star className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">{t.plansAndPricing}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t.choosePerfectPlan}{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {t.forYourBusiness}
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.pricingDescription}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-primary shadow-glow bg-gradient-card' 
                  : 'bg-gradient-card border-border/50'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-hero text-white px-4 py-1">
                  {t.mostPopular}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r mx-auto mb-4 flex items-center justify-center ${
                  plan.popular 
                    ? 'from-primary to-primary-glow' 
                    : 'from-muted to-muted/50'
                }`}>
                  <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-primary'}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant}
                  size="lg" 
                  className={`w-full ${
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
        <div className="bg-gradient-card rounded-2xl p-6 sm:p-8 border border-border/50 shadow-card max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-8">
            {t.frequentQuestions}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-2">¿Hay período de prueba?</h4>
              <p className="text-muted-foreground text-sm">
                Sí, todos los planes incluyen 14 días de prueba gratuita sin necesidad de tarjeta de crédito.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">¿Puedo cambiar de plan?</h4>
              <p className="text-muted-foreground text-sm">
                Absolutamente. Puedes actualizar o degradar tu plan en cualquier momento desde tu panel de control.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">¿Qué métodos de pago aceptan?</h4>
              <p className="text-muted-foreground text-sm">
                Aceptamos todas las tarjetas de crédito principales a través de Stripe, nuestro procesador seguro de pagos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">¿Hay descuentos anuales?</h4>
              <p className="text-muted-foreground text-sm">
                Sí, obtén 2 meses gratis al pagar anualmente. Contáctanos para más detalles sobre precios anuales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}