import { useLanguage } from "@/contexts/language-context";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <article className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">Términos y Condiciones</h1>
          
          <p className="text-muted-foreground mb-8">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">1. Aceptación de Términos</h2>
            <p className="text-base text-muted-foreground">
              Al acceder y utilizar PropGen, usted acepta estar sujeto a estos Términos y Condiciones, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de todas las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">2. Descripción del Servicio</h2>
            <p className="text-base text-muted-foreground mb-4">
              PropGen es una plataforma de automatización de marketing inmobiliario que ofrece:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Generación automática de contenido para redes sociales</li>
              <li>Creación de imágenes y videos promocionales</li>
              <li>Publicación directa en plataformas de redes sociales</li>
              <li>Gestión de propiedades inmobiliarias</li>
              <li>Análisis y reportes de rendimiento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">3. Registro y Cuenta</h2>
            <p className="text-base text-muted-foreground mb-4">
              Para utilizar nuestros servicios, debe:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Proporcionar información precisa y completa durante el registro</li>
              <li>Mantener la seguridad de su contraseña</li>
              <li>Notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta</li>
              <li>Ser mayor de 18 años o tener el consentimiento de un tutor legal</li>
              <li>Ser un agente inmobiliario profesional o tener autorización para publicitar propiedades</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">4. Uso Aceptable</h2>
            <p className="text-base text-muted-foreground mb-4">
              Usted se compromete a no:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Usar el servicio para fines ilegales o no autorizados</li>
              <li>Publicar información falsa o engañosa sobre propiedades</li>
              <li>Violar los derechos de propiedad intelectual de terceros</li>
              <li>Intentar acceder a cuentas de otros usuarios</li>
              <li>Interferir con el funcionamiento del servicio</li>
              <li>Usar el servicio para spam o distribución masiva no solicitada</li>
              <li>Recopilar información de otros usuarios sin su consentimiento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">5. Propiedad Intelectual</h2>
            <p className="text-base text-muted-foreground mb-4">
              <strong>Contenido Generado:</strong> El contenido que usted crea utilizando PropGen le pertenece. Le otorgamos una licencia para usar nuestras herramientas de generación de contenido.
            </p>
            <p className="text-base text-muted-foreground">
              <strong>Plataforma PropGen:</strong> Todos los derechos, títulos e intereses en la plataforma PropGen, incluyendo el software, diseño, marcas registradas y contenido, son propiedad de PropGen y están protegidos por leyes de propiedad intelectual.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">6. Planes y Pagos</h2>
            <p className="text-base text-muted-foreground mb-4">
              <strong>Suscripciones:</strong> Los planes de suscripción se facturan de forma recurrente según el período seleccionado (mensual o anual).
            </p>
            <p className="text-base text-muted-foreground mb-4">
              <strong>Cancelación:</strong> Puede cancelar su suscripción en cualquier momento. No se emitirán reembolsos por períodos de facturación parciales.
            </p>
            <p className="text-base text-muted-foreground">
              <strong>Cambios de Precio:</strong> Nos reservamos el derecho de modificar los precios con previo aviso de 30 días.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">7. Limitación de Responsabilidad</h2>
            <p className="text-base text-muted-foreground">
              PropGen no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de su acceso o uso del servicio. El servicio se proporciona "tal cual" sin garantías de ningún tipo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">8. Indemnización</h2>
            <p className="text-base text-muted-foreground">
              Usted acepta indemnizar y mantener indemne a PropGen de cualquier reclamo, daño, obligación, pérdida, responsabilidad, costo o deuda, y gasto resultante de: (a) su uso del servicio; (b) su violación de estos Términos; (c) su violación de derechos de terceros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">9. Modificaciones del Servicio</h2>
            <p className="text-base text-muted-foreground">
              Nos reservamos el derecho de modificar o discontinuar el servicio (o cualquier parte del mismo) en cualquier momento con o sin previo aviso. No seremos responsables ante usted o terceros por cualquier modificación, suspensión o discontinuación del servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">10. Terminación</h2>
            <p className="text-base text-muted-foreground">
              Podemos terminar o suspender su cuenta inmediatamente, sin previo aviso o responsabilidad, por cualquier motivo, incluyendo sin limitación si usted incumple los Términos. Tras la terminación, su derecho a usar el servicio cesará inmediatamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">11. Ley Aplicable</h2>
            <p className="text-base text-muted-foreground">
              Estos Términos se regirán e interpretarán de acuerdo con las leyes del estado de Texas, Estados Unidos, sin dar efecto a ninguna disposición sobre conflictos de leyes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">12. Contacto</h2>
            <p className="text-base text-muted-foreground">
              Si tiene preguntas sobre estos Términos, contáctenos en:
            </p>
            <p className="text-base text-muted-foreground mt-4">
              Email: <a href="mailto:soporte@propgen.com" className="text-primary hover:underline">soporte@propgen.com</a><br />
              Teléfono: +1 (555) 123-4567
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
