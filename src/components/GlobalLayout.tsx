import React from 'react';
import { useLocation } from 'react-router-dom';
import { MobileNavigation, useMobileNavigation } from '@/components/mobile/MobileNavigation';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { cn } from '@/lib/utils';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const location = useLocation();
  const mobile = useMobileOptimizations();
  const { shouldShowMobileNav } = useMobileNavigation();

  // Pages où la navigation mobile ne doit pas s'afficher
  const hideMobileNavPaths = ['/auth', '/login', '/signin', '/signup', '/register'];
  const shouldHideMobileNav = hideMobileNavPaths.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen w-full">
      {/* Contenu principal avec padding pour la navigation mobile */}
      <div className={cn(
        'w-full transition-all duration-300',
        shouldShowMobileNav && !shouldHideMobileNav && 'pb-20' // Espace pour la navigation mobile
      )}>
        {children}
      </div>

      {/* Navigation mobile globale */}
      {shouldShowMobileNav && !shouldHideMobileNav && (
        <div className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-background/95 backdrop-blur-md border-t border-border/50',
          'safe-area-inset-bottom'
        )}>
          <MobileNavigation />
        </div>
      )}
    </div>
  );
};
