import { Button } from "@/components/ui/button";
import { Building2, LogIn, UserPlus, LayoutDashboard, Zap, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";

export function Navigation() {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const isLandingPage = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-hero p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">PropGen</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isLandingPage ? (
              <>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Características
                </a>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Precios
                </a>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Nosotros
                </a>
              </>
            ) : (
              <>
                 <Link 
                  to="/dashboard" 
                  className={`flex items-center space-x-1 transition-colors ${
                    location.pathname === '/dashboard' 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{t.dashboard}</span>
                </Link>
                <Link 
                  to="/process" 
                  className={`flex items-center space-x-1 transition-colors ${
                    location.pathname === '/process' 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  <span>{t.processProperty}</span>
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                 <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                   <Link to="/auth">
                     <LogIn className="h-4 w-4 mr-2" />
                     Iniciar Sesión
                   </Link>
                 </Button>
                 <Button size="sm" className="bg-gradient-hero hover:shadow-glow transition-all duration-300" asChild>
                   <Link to="/auth">
                     <UserPlus className="h-4 w-4 mr-2" />
                     Registrarse
                   </Link>
                 </Button>
              </>
            ) : (
              <>
                 <Button variant="ghost" size="sm" className="flex items-center gap-2" asChild>
                   <Link to="/profile">
                     <User className="h-4 w-4" />
                     {profile?.full_name || user.email?.split('@')[0]}
                   </Link>
                 </Button>
                 <Button variant="outline" size="sm" onClick={signOut} className="flex items-center gap-2">
                   <LogOut className="h-4 w-4" />
                   {t.logout}
                 </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}