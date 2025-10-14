import { useLanguage } from "@/contexts/language-context";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";

export default function Cookies() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <article className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">Política de Cookies</h1>
          
          <p className="text-muted-foreground mb-8">
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">¿Qué son las cookies?</h2>
            <p className="text-base text-muted-foreground">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">¿Cómo usamos las cookies?</h2>
            <p className="text-base text-muted-foreground mb-4">
              PropGen utiliza cookies para varios propósitos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Mantener su sesión iniciada</li>
              <li>Recordar sus preferencias de idioma y configuración</li>
              <li>Analizar cómo usa nuestra plataforma</li>
              <li>Mejorar la seguridad del sitio</li>
              <li>Personalizar su experiencia</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Tipos de cookies que utilizamos</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">1. Cookies Esenciales</h3>
              <p className="text-base text-muted-foreground mb-2">
                Estas cookies son necesarias para que el sitio web funcione y no se pueden desactivar en nuestros sistemas.
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Autenticación:</strong> Mantienen su sesión iniciada</li>
                <li><strong>Seguridad:</strong> Protegen contra ataques maliciosos</li>
                <li><strong>Funcionalidad:</strong> Permiten navegar y usar funciones básicas</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">2. Cookies de Rendimiento</h3>
              <p className="text-base text-muted-foreground mb-2">
                Nos permiten contar visitas y fuentes de tráfico para mejorar el rendimiento de nuestro sitio.
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Analíticas:</strong> Comprenden cómo los visitantes interactúan con el sitio</li>
                <li><strong>Optimización:</strong> Ayudan a mejorar la velocidad y rendimiento</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">3. Cookies de Funcionalidad</h3>
              <p className="text-base text-muted-foreground mb-2">
                Permiten que el sitio web recuerde las elecciones que hace (como su idioma o región).
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Preferencias:</strong> Guardan su idioma, tema y otras configuraciones</li>
                <li><strong>Personalización:</strong> Adaptan la experiencia a sus necesidades</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">4. Cookies de Publicidad (Si aplicable)</h3>
              <p className="text-base text-muted-foreground mb-2">
                Estas cookies se utilizan para hacer que los anuncios sean más relevantes para usted.
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Marketing:</strong> Rastrean su visita a través de sitios web</li>
                <li><strong>Retargeting:</strong> Muestran anuncios relevantes basados en sus intereses</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Cookies de terceros</h2>
            <p className="text-base text-muted-foreground mb-4">
              Además de nuestras propias cookies, también podemos usar varias cookies de terceros para informar estadísticas de uso del servicio e interacciones con el servicio:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Google Analytics:</strong> Para analizar el uso del sitio web</li>
              <li><strong>Supabase:</strong> Para autenticación y gestión de base de datos</li>
              <li><strong>Redes Sociales:</strong> Para compartir contenido en plataformas sociales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Duración de las cookies</h2>
            <div className="mb-4">
              <p className="text-base text-muted-foreground mb-2">
                <strong>Cookies de sesión:</strong> Se eliminan cuando cierra su navegador
              </p>
              <p className="text-base text-muted-foreground">
                <strong>Cookies persistentes:</strong> Permanecen en su dispositivo durante un período establecido o hasta que las elimine manualmente
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Cómo controlar las cookies</h2>
            <p className="text-base text-muted-foreground mb-4">
              Puede controlar y/o eliminar cookies como desee. Puede eliminar todas las cookies que ya están en su computadora y puede configurar la mayoría de los navegadores para evitar que se coloquen.
            </p>
            <div className="mb-4">
              <p className="text-base text-muted-foreground mb-2 font-semibold">
                Configuración del navegador:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
                <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
                <li><strong>Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies</li>
              </ul>
            </div>
            <p className="text-base text-muted-foreground">
              Tenga en cuenta que si deshabilita las cookies, es posible que algunas partes del sitio web no funcionen correctamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Cambios en esta política</h2>
            <p className="text-base text-muted-foreground">
              Podemos actualizar nuestra Política de Cookies de vez en cuando. Le notificaremos sobre cualquier cambio publicando la nueva Política de Cookies en esta página y actualizando la fecha de "última actualización".
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Más información</h2>
            <p className="text-base text-muted-foreground mb-4">
              Para más información sobre cómo usamos, almacenamos y protegemos sus datos personales, consulte nuestra <a href="/privacy" className="text-primary hover:underline">Política de Privacidad</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Contacto</h2>
            <p className="text-base text-muted-foreground">
              Si tiene preguntas sobre nuestra Política de Cookies, contáctenos en:
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
