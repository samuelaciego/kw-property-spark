import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-foreground text-background py-10 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="bg-gradient-hero p-1.5 sm:p-2 rounded-lg">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold">PropGen</span>
            </div>
            <p className="text-sm sm:text-base text-background/80 mb-4 sm:mb-6 max-w-md">
              {t.footerDescription}
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-background/60">
              <span>© 2024 PropGen</span>
              <span>•</span>
              <span>Keller Williams Partner</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2 text-sm sm:text-base text-background/80">
              <li>
                <a href="#features" className="hover:text-white transition-colors inline-block py-1">
                  {t.features}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors inline-block py-1">
                  Precios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors inline-block py-1">
                  Tutoriales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors inline-block py-1">
                  Soporte
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors inline-block py-1">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">{t.contact}</h3>
            <ul className="space-y-3 text-sm sm:text-base text-background/80">
              <li className="flex items-center">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm">soporte@propgen.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  Austin, TX<br />
                  Estados Unidos
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-background/60">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="/privacy" className="hover:text-white transition-colors py-1">Privacidad</a>
            <a href="/terms" className="hover:text-white transition-colors py-1">Términos</a>
            <a href="/cookies" className="hover:text-white transition-colors py-1">Cookies</a>
          </div>
          <div className="text-center">
            <span>Hecho con ❤️ para agentes inmobiliarios</span>
          </div>
        </div>
      </div>
    </footer>
  );
}