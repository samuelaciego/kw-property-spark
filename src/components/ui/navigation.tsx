import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSelector } from "@/components/ui/language-selector";

export function Navigation() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isLandingPage = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary px-2 py-1.5 md:px-3 md:py-2 rounded-lg">
              <span className="text-base md:text-xl font-bold text-primary-foreground">KW</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-foreground">PropGen</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isLandingPage ? (
              <>
                <a href="#features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {t.features}
                </a>
                <a href="#pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {t.pricing}
                </a>
              </>
            ) : (
              <>
                {user && (
                  <>
                    <Link to="/dashboard" className={`text-sm font-medium transition-colors ${
                      isDashboard ? 'text-primary' : 'text-foreground hover:text-primary'
                    }`}>
                      Dashboard
                    </Link>
                    <Link to="/process" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                      {t.processProperty}
                    </Link>
                  </>
                )}
              </>
            )}

            <LanguageSelector />

            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">{t.profile}</span>
                  </Button>
                </Link>
                <Button onClick={signOut} variant="outline" size="sm">
                  {t.logout}
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">{t.login}</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-hero">{t.signUp}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            {isLandingPage ? (
              <>
                <a 
                  href="#features" 
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.features}
                </a>
                <a 
                  href="#pricing" 
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.pricing}
                </a>
              </>
            ) : (
              <>
                {user && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        isDashboard ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/process" 
                      className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t.processProperty}
                    </Link>
                  </>
                )}
              </>
            )}

            {user ? (
              <div className="space-y-2 px-4">
                <Link to="/profile" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="lg" className="w-full justify-start gap-2">
                    <User className="h-5 w-5" />
                    {t.profile}
                  </Button>
                </Link>
                <Button 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }} 
                  variant="outline" 
                  size="lg"
                  className="w-full"
                >
                  {t.logout}
                </Button>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                <Link to="/auth" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="lg" className="w-full">{t.login}</Button>
                </Link>
                <Link to="/auth" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button size="lg" className="w-full bg-gradient-hero">{t.signUp}</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
