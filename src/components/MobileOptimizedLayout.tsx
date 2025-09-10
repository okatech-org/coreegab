import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMobileOptimizations, useTouchGestures, useNetworkStatus } from '@/hooks/useMobileOptimizations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Smartphone, Tablet, Monitor } from 'lucide-react';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  showDeviceInfo?: boolean;
  enableSwipeGestures?: boolean;
  className?: string;
}

export const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({
  children,
  showDeviceInfo = false,
  enableSwipeGestures = true,
  className,
}) => {
  const mobile = useMobileOptimizations();
  const gesture = useTouchGestures();
  const { isOnline, connectionType } = useNetworkStatus();
  const [showNetworkStatus, setShowNetworkStatus] = useState(false);

  // Afficher le statut réseau en cas de problème
  useEffect(() => {
    if (!isOnline) {
      setShowNetworkStatus(true);
      const timer = setTimeout(() => setShowNetworkStatus(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  // Classes CSS adaptatives selon l'appareil
  const getLayoutClasses = () => {
    const baseClasses = 'min-h-screen w-full';
    
    if (mobile.isMobile) {
      return cn(
        baseClasses,
        'touch-manipulation', // Optimise les interactions tactiles
        'select-none', // Évite la sélection accidentelle
        mobile.isIOS && 'ios-safe-area', // Safe area pour iOS
        mobile.orientation === 'landscape' && 'landscape-mode'
      );
    }
    
    if (mobile.isTablet) {
      return cn(baseClasses, 'tablet-optimized');
    }
    
    return cn(baseClasses, 'desktop-optimized');
  };

  // Gestion des gestes de swipe
  useEffect(() => {
    if (!enableSwipeGestures || !gesture.type) return;

    if (gesture.type === 'swipe') {
      // Ici vous pouvez ajouter des actions basées sur les gestes
      console.log(`Swipe ${gesture.direction} detected`);
      
      // Exemple : navigation par swipe
      if (gesture.direction === 'left') {
        // Aller à la page suivante
      } else if (gesture.direction === 'right') {
        // Aller à la page précédente
      }
    }
  }, [gesture, enableSwipeGestures]);

  return (
    <div className={cn(getLayoutClasses(), className)}>
      {/* Indicateur de statut réseau */}
      {showNetworkStatus && (
        <div className={cn(
          'fixed top-0 left-0 right-0 z-50 p-2 text-center text-sm font-medium transition-all duration-300',
          isOnline 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        )}>
          <div className="flex items-center justify-center gap-2">
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {isOnline 
              ? `Connexion rétablie (${connectionType})`
              : 'Pas de connexion Internet'
            }
          </div>
        </div>
      )}

      {/* Informations de débogage (développement uniquement) */}
      {showDeviceInfo && process.env.NODE_ENV === 'development' && (
        <Card className="fixed bottom-4 right-4 z-40 w-64">
          <CardContent className="p-3 text-xs space-y-1">
            <div className="flex items-center gap-2 mb-2">
              {mobile.isMobile && <Smartphone className="w-3 h-3" />}
              {mobile.isTablet && <Tablet className="w-3 h-3" />}
              {mobile.isDesktop && <Monitor className="w-3 h-3" />}
              <span className="font-semibold">Device Info</span>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <span>Taille:</span>
              <Badge variant="outline" className="text-xs">{mobile.screenSize}</Badge>
              
              <span>Orientation:</span>
              <Badge variant="outline" className="text-xs">{mobile.orientation}</Badge>
              
              <span>Touch:</span>
              <Badge variant={mobile.touchSupport ? "default" : "secondary"} className="text-xs">
                {mobile.touchSupport ? 'Oui' : 'Non'}
              </Badge>
              
              <span>Platform:</span>
              <Badge variant="outline" className="text-xs">
                {mobile.isIOS ? 'iOS' : mobile.isAndroid ? 'Android' : 'Other'}
              </Badge>
              
              <span>Réseau:</span>
              <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
                {isOnline ? connectionType : 'Offline'}
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              {mobile.viewportWidth}x{mobile.viewportHeight}
            </div>
            
            {gesture.type && (
              <div className="text-xs text-blue-600">
                Geste: {gesture.type} {gesture.direction}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contenu principal */}
      <div className={cn(
        'w-full',
        mobile.isMobile && 'mobile-content',
        mobile.isTablet && 'tablet-content',
        mobile.isDesktop && 'desktop-content'
      )}>
        {children}
      </div>

      {/* Styles CSS injectés pour les optimisations */}
      <style>{`
        .ios-safe-area {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }
        
        .mobile-content {
          /* Optimisations pour mobile */
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        
        .tablet-content {
          /* Optimisations pour tablette */
          touch-action: manipulation;
        }
        
        .landscape-mode {
          /* Ajustements pour mode paysage */
          --header-height: 3rem;
        }
        
        /* Optimisations tactiles */
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Améliorations de performance mobile */
        @media (max-width: 768px) {
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          img {
            image-rendering: -webkit-optimize-contrast;
          }
          
          /* Réduire les animations sur les appareils lents */
          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        }
        
        /* Optimisations pour les connexions lentes */
        @media (max-width: 768px) and (max-resolution: 150dpi) {
          .high-res-image {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
