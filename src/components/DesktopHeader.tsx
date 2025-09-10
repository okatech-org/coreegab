import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySwitcher } from './CurrencySwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

interface DesktopHeaderProps {
  title?: string;
  children?: React.ReactNode;
  rightContent?: React.ReactNode;
  showNavigation?: boolean;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ 
  title, 
  children, 
  rightContent,
  showNavigation = true 
}) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="hidden lg:flex h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full px-6">
        {/* Section gauche */}
        <div className="flex items-center gap-4">
          {title && (
            <h1 className="text-xl font-semibold">{title}</h1>
          )}
          
          {/* Navigation principale - uniquement si pas de sidebar ou demandée explicitement */}
          {showNavigation && (
            <nav className="flex items-center gap-6">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Accueil
              </Link>
              <Link 
                to="/boutique" 
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Boutique
              </Link>
              <Link 
                to="/calculator" 
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Calculateur
              </Link>
              <a 
                href="/#services" 
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Services
              </a>
              <a 
                href="/#contact" 
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Contact
              </a>
            </nav>
          )}
          
          {/* Contenu personnalisé */}
          {children}
        </div>

        {/* Section droite avec contrôles */}
        <div className="flex items-center gap-3">
          {/* Contenu personnalisé à droite */}
          {rightContent}
          
          <CurrencySwitcher />
          <LanguageSwitcher />
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const dashboardRoutes = {
                    client: '/client-dashboard',
                    commercial: '/commercial-dashboard',
                    admin: '/admin-dashboard',
                  };
                  navigate(dashboardRoutes[profile?.role || 'client']);
                }}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                {profile?.name || 'Mon compte'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Se connecter
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
