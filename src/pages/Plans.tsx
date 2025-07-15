import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/app-layout";
import { Check, Star, Zap, Crown, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    id: "free",
    name: "Gratuito",
    price: "$0",
    period: "/mes",
    description: "Perfecto para empezar a probar la plataforma",
    icon: Zap,
    features: [
      "5 propiedades por mes",
      "Imágenes básicas para redes sociales",
      "Plantillas predefinidas",
      "Soporte por email",
      "Historial de 7 días"
    ],
    buttonText: "Plan Actual",
    buttonVariant: "outline" as const,
    popular: false,
    current: true
  },
  {
    id: "basic",
    name: "Básico",
    price: "$29",
    period: "/mes",
    description: "Ideal para agentes que están comenzando",
    icon: Zap,
    features: [
      "50 propiedades por mes",
      "Imágenes para redes sociales",
      "Textos básicos con hashtags",
      "Soporte por email",
      "Historial de 30 días",
      "Plantillas personalizables"
    ],
    buttonText: "Actualizar a Básico",
    buttonVariant: "outline" as const,
    popular: false,
    current: false
  },
  {
    id: "premium",
    name: "Premium",
    price: "$79",
    period: "/mes",
    description: "La opción más popular para agentes activos",
    icon: Star,
    features: [
      "200 propiedades por mes",
      "Imágenes + Videos automáticos",
      "Contenido optimizado con IA",
      "Branding personalizado",
      "Soporte prioritario",
      "Historial ilimitado",
      "Analytics avanzados",
      "Integración con CRM"
    ],
    buttonText: "Actualizar a Premium",
    buttonVariant: "default" as const,
    popular: true,
    current: false
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$199",
    period: "/mes",
    description: "Para equipos y oficinas completas",
    icon: Crown,
    features: [
      "Propiedades ilimitadas",
      "Todo del plan Premium",
      "Múltiples usuarios",
      "Plantillas personalizadas",
      "API para integraciones",
      "Gerente de cuenta dedicado",
      "Capacitación personalizada",
      "White label disponible"
    ],
    buttonText: "Contactar Ventas",
    buttonVariant: "outline" as const,
    popular: false,
    current: false
  }
];

export default function Plans() {
  const handlePlanSelection = (planId: string) => {
    // Aquí se implementaría la lógica de cambio de plan
    console.log('Seleccionado plan:', planId);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/profile"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Perfil
          </Link>
          <h1 className="text-3xl font-bold mb-2">Planes y Precios</h1>
          <p className="text-muted-foreground">
            Elige el plan perfecto para tu agencia inmobiliaria
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-primary shadow-glow bg-gradient-card' 
                  : plan.current
                  ? 'border-accent bg-gradient-card'
                  : 'bg-gradient-card border-border/50'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-hero text-white px-4 py-1">
                  Más Popular
                </Badge>
              )}
              
              {plan.current && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1">
                  Plan Actual
                </Badge>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r mx-auto mb-4 flex items-center justify-center ${
                  plan.popular 
                    ? 'from-primary to-primary-glow' 
                    : plan.current
                    ? 'from-accent to-accent/80'
                    : 'from-muted to-muted/50'
                }`}>
                  <plan.icon className={`h-8 w-8 ${
                    plan.popular ? 'text-white' : 
                    plan.current ? 'text-accent-foreground' : 
                    'text-primary'
                  }`} />
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
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.current ? "secondary" : plan.buttonVariant}
                  size="lg" 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-hero hover:shadow-glow' 
                      : ''
                  } transition-all duration-300`}
                  onClick={() => handlePlanSelection(plan.id)}
                  disabled={plan.current}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Comparación de Características</CardTitle>
            <CardDescription>
              Encuentra el plan perfecto comparando todas las características
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Característica</th>
                    <th className="text-center py-3 px-4">Gratuito</th>
                    <th className="text-center py-3 px-4">Básico</th>
                    <th className="text-center py-3 px-4">Premium</th>
                    <th className="text-center py-3 px-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">Propiedades por mes</td>
                    <td className="text-center py-3 px-4">5</td>
                    <td className="text-center py-3 px-4">50</td>
                    <td className="text-center py-3 px-4">200</td>
                    <td className="text-center py-3 px-4">Ilimitadas</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Imágenes para redes sociales</td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-accent" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-accent" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-accent" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-accent" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Videos automáticos</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-accent" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-accent" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Branding personalizado</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-accent" /></td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-accent" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Múltiples usuarios</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4"><Check className="h-4 w-4 mx-auto text-accent" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Soporte</td>
                    <td className="text-center py-3 px-4">Email</td>
                    <td className="text-center py-3 px-4">Email</td>
                    <td className="text-center py-3 px-4">Prioritario</td>
                    <td className="text-center py-3 px-4">Dedicado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">¿Puedo cambiar de plan en cualquier momento?</h4>
                <p className="text-muted-foreground text-sm">
                  Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplicarán en tu próximo ciclo de facturación.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">¿Hay período de prueba?</h4>
                <p className="text-muted-foreground text-sm">
                  Todos los planes de pago incluyen 14 días de prueba gratuita sin necesidad de tarjeta de crédito.
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
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}