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
  Settings,
  Sun,
  DollarSign,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { useCart } from '@/hooks/useCart';
import { useNotifications } from '@/components/NotificationSystem';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';

export const MobileNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const mobile = useMobileOptimizations();
  const { getCartCount } = useCart();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  // Navigation principale selon le statut de connexion et le rôle
  const getMainNavItems = () => {
    if (!user) {
      // Utilisateur non connecté: Accueil, Boutique, Recherche, Calculateur, Menu
      return [
        { to: '/', icon: Home, label: 'Accueil' },
        { to: '/boutique', icon: ShoppingBag, label: 'Boutique' },
        { to: '/search', icon: Search, label: 'Recherche' },
        { to: '/calculator', icon: Calculator, label: 'Calculateur' },
      ];
    }
    
    if (profile?.role === 'client') {
      // Client connecté: Boutique, Recherche, Panier, Profil, Menu
      return [
        { to: '/boutique', icon: ShoppingBag, label: 'Boutique' },
        { to: '/search', icon: Search, label: 'Recherche' },
        { to: '/boutique?view=cart', icon: ShoppingCart, label: 'Panier', badge: getCartCount() > 0 ? getCartCount() : undefined },
        { 
          to: '/client-dashboard', 
          icon: User, 
          label: 'Profil',
          badge: unreadCount > 0 ? unreadCount : undefined
        },
      ];
    }
    
    if (profile?.role === 'admin') {
      // Admin: Dashboard, Boutique, Produits, Utilisateurs, Menu
      return [
        { to: '/admin-dashboard', icon: Settings, label: 'Dashboard' },
        { to: '/boutique', icon: ShoppingBag, label: 'Boutique' },
        { to: '/admin-import', icon: Package, label: 'Produits' },
        { to: '/admin-dashboard', icon: User, label: 'Utilisateurs' },
      ];
    }
    
    if (profile?.role === 'commercial') {
      // Commercial: Dashboard, Chat, Boutique, Commandes, Menu
      return [
        { to: '/commercial-dashboard', icon: MessageCircle, label: 'Dashboard' },
        { to: '/commercial-chat', icon: MessageCircle, label: 'Chat' },
        { to: '/boutique', icon: ShoppingBag, label: 'Boutique' },
        { to: '/orders', icon: Package, label: 'Commandes' },
      ];
    }
    
    // Par défaut (client)
    return [
      { to: '/boutique', icon: ShoppingBag, label: 'Boutique' },
      { to: '/search', icon: Search, label: 'Recherche' },
      { to: '/boutique', icon: ShoppingCart, label: 'Panier' },
      { to: '/client-dashboard', icon: User, label: 'Profil' },
    ];
  };

  const mainNavItems = getMainNavItems();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Barre de navigation fixe en bas (mobile) - ULTRA COMPACTE
  const BottomTabBar = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden w-full max-w-full">
      <div className="flex items-center justify-between py-1 px-1 w-full max-w-full">
        {mainNavItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          
          return (
            <NavLink
              key={`${item.to}-${index}`}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-0 p-1 rounded-md flex-1 max-w-[20%] transition-colors',
                active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {item.badge && (
                  <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 text-[8px] rounded-full flex items-center justify-center min-w-[8px]">
                    {item.badge > 9 ? '9+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-[8px] font-medium leading-tight mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}
        
        {/* Menu burger pour plus d'options */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="flex flex-col gap-0 p-1 flex-1 max-w-[20%]">
              <div className="relative">
                <Menu className="w-4 h-4" />
                {(unreadCount > 0 || !user) && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-destructive rounded-full" />
                )}
              </div>
              <span className="text-[8px] font-medium leading-tight mt-0.5">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] max-w-full">
            <div className="space-y-6 pt-4 max-w-full">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Menu COREGAB</h3>
                {user && (
                  <p className="text-sm text-muted-foreground">
                    Connecté en tant que {profile?.name}
                  </p>
                )}
              </div>

              {/* Contenu selon le statut utilisateur */}
              {!user ? (
                // Utilisateur non connecté: Services, Contact, Paramètres
                <>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Informations
                    </h4>
                    
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setTimeout(() => {
                          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Services</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setTimeout(() => {
                          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Contact</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Paramètres
                    </h4>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5" />
                        <span>Devise</span>
                      </div>
                      <CurrencySwitcher />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5" />
                        <span>Langue</span>
                      </div>
                      <LanguageSwitcher />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Compte
                    </h4>
                    <NavLink
                      to="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>Se connecter</span>
                    </NavLink>
                  </div>
                </>
              ) : (
                // Utilisateur connecté: Contenu adapté selon le rôle
                <>
                  {/* Navigation additionnelle selon le rôle */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Navigation
                    </h4>
                    
                    {profile?.role === 'client' && (
                      <>
                        <NavLink
                          to="/"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Home className="w-5 h-5" />
                          <span>Accueil</span>
                        </NavLink>
                        <NavLink
                          to="/calculator"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Calculator className="w-5 h-5" />
                          <span>Calculateur</span>
                        </NavLink>
                        <NavLink
                          to="/orders"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Package className="w-5 h-5" />
                          <span>Mes commandes</span>
                        </NavLink>
                      </>
                    )}
                    
                    {profile?.role === 'admin' && (
                      <>
                        <NavLink
                          to="/"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Home className="w-5 h-5" />
                          <span>Accueil</span>
                        </NavLink>
                        <NavLink
                          to="/calculator"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Calculator className="w-5 h-5" />
                          <span>Calculateur</span>
                        </NavLink>
                      </>
                    )}
                    
                    {profile?.role === 'commercial' && (
                      <>
                        <NavLink
                          to="/"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Home className="w-5 h-5" />
                          <span>Accueil</span>
                        </NavLink>
                        <NavLink
                          to="/calculator"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Calculator className="w-5 h-5" />
                          <span>Calculateur</span>
                        </NavLink>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setTimeout(() => {
                          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Services</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setTimeout(() => {
                          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Contact</span>
                    </button>
                  </div>

                  {/* Paramètres */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Paramètres
                    </h4>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5" />
                        <span>Devise</span>
                      </div>
                      <CurrencySwitcher />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5" />
                        <span>Langue</span>
                      </div>
                      <LanguageSwitcher />
                    </div>
                  </div>

                  {/* Compte utilisateur */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Mon compte
                    </h4>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
                    >
                      <User className="w-5 h-5" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </>
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
    ? `calc(100vh - ${mobile.safeAreaTop + mobile.safeAreaBottom + 60}px)` // 60px pour bottom nav compacte
    : '100vh';

  return {
    shouldShowMobileNav,
    contentHeight,
    isMobile: mobile.isMobile,
    isTablet: mobile.isTablet,
    orientation: mobile.orientation,
  };
};