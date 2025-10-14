import { useLanguage } from "@/contexts/language-context";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";

export default function Privacy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <article className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">Política de Privacidad</h1>
          
          <p className="text-muted-foreground mb-8">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">1. Información que Recopilamos</h2>
            <p className="text-base text-muted-foreground mb-4">
              En PropGen, recopilamos la siguiente información:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Información de cuenta: nombre, correo electrónico, número de teléfono</li>
              <li>Información profesional: nombre de agencia, información de contacto profesional</li>
              <li>Datos de propiedades: direcciones, fotos, descripciones que usted carga</li>
              <li>Datos de uso: cómo interactúa con nuestra plataforma</li>
              <li>Información técnica: dirección IP, tipo de navegador, dispositivo</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">2. Cómo Usamos su Información</h2>
            <p className="text-base text-muted-foreground mb-4">
              Utilizamos su información para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Generar contenido para redes sociales de sus propiedades</li>
              <li>Comunicarnos con usted sobre su cuenta y servicios</li>
              <li>Procesar pagos y transacciones</li>
              <li>Analizar el uso de la plataforma para mejorar la experiencia</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">3. Compartir Información</h2>
            <p className="text-base text-muted-foreground mb-4">
              No vendemos su información personal. Compartimos información solo con:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Proveedores de servicios que nos ayudan a operar la plataforma</li>
              <li>Plataformas de redes sociales cuando usted publica contenido</li>
              <li>Autoridades legales cuando sea requerido por ley</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">4. Seguridad de Datos</h2>
            <p className="text-base text-muted-foreground">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye cifrado de datos, controles de acceso y auditorías de seguridad regulares.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">5. Sus Derechos</h2>
            <p className="text-base text-muted-foreground mb-4">
              Usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Acceder a su información personal</li>
              <li>Corregir datos inexactos</li>
              <li>Solicitar la eliminación de su información</li>
              <li>Oponerse al procesamiento de sus datos</li>
              <li>Portabilidad de datos</li>
              <li>Retirar consentimiento en cualquier momento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">6. Cookies y Tecnologías Similares</h2>
            <p className="text-base text-muted-foreground">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso de la plataforma y personalizar contenido. Consulte nuestra <a href="/cookies" className="text-primary hover:underline">Política de Cookies</a> para más detalles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">7. Retención de Datos</h2>
            <p className="text-base text-muted-foreground">
              Retenemos su información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que la ley requiera o permita un período de retención más largo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">8. Transferencias Internacionales</h2>
            <p className="text-base text-muted-foreground">
              Sus datos pueden ser transferidos y procesados en países fuera de su país de residencia. Garantizamos que dichas transferencias cumplan con las leyes de protección de datos aplicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">9. Cambios a esta Política</h2>
            <p className="text-base text-muted-foreground">
              Podemos actualizar esta política de privacidad periódicamente. Le notificaremos sobre cambios significativos publicando la nueva política en esta página y actualizando la fecha de "última actualización".
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">10. Contacto</h2>
            <p className="text-base text-muted-foreground">
              Si tiene preguntas sobre esta política de privacidad, contáctenos en:
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
