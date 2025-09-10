import React from 'react';
import { Button } from '@/components/ui/button';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  title?: string;
  showLogo?: boolean;
  className?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = "COREGAB",
  showLogo = true,
  className = ""
}) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className={`lg:hidden bg-transparent border-0 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 rounded-xl">
        <div className="flex items-center gap-3">
          {showLogo && (
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png" 
                alt="COREGAB Logo" 
                className="w-8 h-8"
              />
              <span className="text-foreground font-bold text-lg">{title}</span>
            </div>
          )}
          {!showLogo && (
            <span className="text-foreground font-bold text-lg">{title}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!user ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/auth')}
              className="text-xs px-3 py-1"
            >
              Se connecter
            </Button>
          ) : (
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
              className="text-xs px-2 py-1"
            >
              {profile?.name || 'Mon compte'}
            </Button>
          )}
          <PWAInstallButton variant="ghost" size="sm" />
        </div>
      </div>
    </header>
  );
};
