import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  ShoppingBag, 
  Calculator, 
  Search, 
  User, 
  MessageCircle,
  Menu,
  Bell,
  ShoppingCart,
  Package,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { useCart } from '@/hooks/useCart';
import { useNotifications } from '@/components/NotificationSystem';
import { cn } from '@/lib/utils';

export const MobileNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const mobile = useMobileOptimizations();
  const { getCartCount } = useCart();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  // Navigation principale pour mobile
  const mainNavItems = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/boutique', icon: ShoppingBag, label: 'Boutique' },
    { to: '/calculator', icon: Calculator, label: 'Calculateur' },
    { to: '/search', icon: Search, label: 'Recherche' },
  ];

  // Navigation utilisateur
  const userNavItems = user ? [
    { 
      to: profile?.role === 'admin' ? '/admin-dashboard' : 
          profile?.role === 'commercial' ? '/commercial-dashboard' : 
          '/client-dashboard', 
      icon: User, 
      label: 'Mon compte' 
    },
    { to: '/chat', icon: MessageCircle, label: 'Support' },
  ] : [
    { to: '/auth', icon: User, label: 'Se connecter' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Barre de navigation fixe en bas (mobile)
  const BottomTabBar = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px] transition-colors',
                active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.to === '/boutique' && getCartCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs rounded-full">
                    {getCartCount()}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
        
        {/* Menu burger pour plus d'options */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="flex flex-col gap-1 p-2 min-w-[60px]">
              <div className="relative">
                <Menu className="w-5 h-5" />
                {(unreadCount > 0 || !user) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
              </div>
              <span className="text-xs font-medium">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh]">
            <div className="space-y-6 pt-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Menu COREGAB</h3>
                {user && (
                  <p className="text-sm text-muted-foreground">
                    Connecté en tant que {profile?.name}
                  </p>
                )}
              </div>

              {/* Navigation utilisateur */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Compte
                </h4>
                {userNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.to.includes('dashboard') && unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {unreadCount}
                        </Badge>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              {/* Actions rapides */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions rapides
                </h4>
                
                <NavLink
                  to="/boutique"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Mon panier</span>
                  {getCartCount() > 0 && (
                    <Badge className="ml-auto">{getCartCount()}</Badge>
                  )}
                </NavLink>

                {user && (
                  <NavLink
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    <span>Mes commandes</span>
                  </NavLink>
                )}
              </div>

              {/* Informations de l'appareil (dev) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
                  <p>📱 {mobile.screenSize} • {mobile.orientation}</p>
                  <p>🌐 {mobile.isOnline ? 'En ligne' : 'Hors ligne'}</p>
                  <p>📏 {mobile.viewportWidth}x{mobile.viewportHeight}</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );

  return <BottomTabBar />;
};

// Hook pour gérer la navigation mobile
export const useMobileNavigation = () => {
  const mobile = useMobileOptimizations();
  const location = useLocation();
  
  // Calculer si on doit afficher la navigation mobile
  const shouldShowMobileNav = mobile.isMobile && !location.pathname.includes('auth');
  
  // Calculer la hauteur de contenu disponible
  const contentHeight = mobile.isMobile 
    ? `calc(100vh - ${mobile.safeAreaTop + mobile.safeAreaBottom + 120}px)` // 120px pour header + bottom nav
    : '100vh';

  return {
    shouldShowMobileNav,
    contentHeight,
    isMobile: mobile.isMobile,
    isTablet: mobile.isTablet,
    orientation: mobile.orientation,
  };
};
