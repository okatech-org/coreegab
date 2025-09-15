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
  Globe,
  Upload,
  BarChart3,
  TrendingUp,
  Users,
  Plus
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

  // Mock stats pour les admins - À remplacer par de vraies données
  const stats = { pending: 3, confirmed: 5, shipping: 2, delivered: 12 };

  // Navigation principale selon le statut de connexion et le rôle - HIÉRARCHISÉE PAR PRIORITÉ
  const getMainNavItems = () => {
    if (!user) {
      // Utilisateur non connecté - Priorité: Découverte → Action → Outils → Informations
      return [
        { to: '/', icon: Home, label: 'Accueil', priority: 1 },
        { to: '/boutique', icon: ShoppingBag, label: 'Boutique', priority: 2, highlight: true },
        { to: '/search', icon: Search, label: 'Recherche', priority: 3 },
        { to: '/calculator', icon: Calculator, label: 'Prix', priority: 4 },
      ];
    }
    
    if (profile?.role === 'client') {
      // Client connecté - Priorité: Shopping → Gestion → Suivi → Profil
      return [
        { 
          to: '/boutique', 
          icon: ShoppingBag, 
          label: 'Boutique', 
          priority: 1, 
          highlight: true 
        },
        { 
          to: '/boutique?view=cart', 
          icon: ShoppingCart, 
          label: 'Panier', 
          priority: 2,
          badge: getCartCount() > 0 ? getCartCount() : undefined,
          pulse: getCartCount() > 0
        },
        { 
          to: '/search', 
          icon: Search, 
          label: 'Recherche', 
          priority: 3 
        },
        { 
          to: '/client-dashboard', 
          icon: User, 
          label: 'Compte',
          priority: 4,
          badge: unreadCount > 0 ? unreadCount : undefined,
          pulse: unreadCount > 0
        },
      ];
    }
    
    if (profile?.role === 'admin') {
      // Admin - Priorité: Gestion → Analytics → Produits → Système
      return [
        { 
          to: '/admin-dashboard', 
          icon: Settings, 
          label: 'Dashboard', 
          priority: 1,
          highlight: true
        },
        { 
          to: '/admin-dashboard?tab=orders', 
          icon: Package, 
          label: 'Commandes', 
          priority: 2,
          badge: (stats?.pending || 0) > 0 ? stats.pending : undefined,
          pulse: (stats?.pending || 0) > 0
        },
        { 
          to: '/admin-import', 
          icon: Upload, 
          label: 'Produits', 
          priority: 3 
        },
        { 
          to: '/admin-dashboard?tab=analytics', 
          icon: BarChart3, 
          label: 'Analytics', 
          priority: 4 
        },
      ];
    }
    
    if (profile?.role === 'commercial') {
      // Commercial - Priorité: Ventes → Communication → Clients → Outils
      return [
        { 
          to: '/commercial-dashboard', 
          icon: TrendingUp, 
          label: 'Ventes', 
          priority: 1,
          highlight: true
        },
        { 
          to: '/commercial-chat', 
          icon: MessageCircle, 
          label: 'Chat', 
          priority: 2,
          badge: unreadCount > 0 ? unreadCount : undefined,
          pulse: unreadCount > 0
        },
        { 
          to: '/commercial-dashboard?view=clients', 
          icon: Users, 
          label: 'Clients', 
          priority: 3 
        },
        { 
          to: '/boutique', 
          icon: ShoppingBag, 
          label: 'Catalogue', 
          priority: 4 
        },
      ];
    }
    
    // Par défaut (client)
    return [
      { to: '/boutique', icon: ShoppingBag, label: 'Boutique', priority: 1 },
      { to: '/search', icon: Search, label: 'Recherche', priority: 2 },
      { to: '/boutique', icon: ShoppingCart, label: 'Panier', priority: 3 },
      { to: '/client-dashboard', icon: User, label: 'Profil', priority: 4 },
    ];
  };

  const mainNavItems = getMainNavItems();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Barre de navigation flottante en bas (mobile) - UX AMÉLIORÉE
  const BottomTabBar = () => (
    <div className="lg:hidden w-full bg-transparent border-0">
      {/* Indicateur de sécurité pour safe area */}
      <div className="safe-area-inset-bottom" />
      
      <div className="flex items-center justify-between py-2 px-2 w-full">
        {mainNavItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          const isHighlighted = item.highlight;
          const hasPulse = item.pulse;
          
          return (
            <NavLink
              key={`${item.to}-${index}`}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl flex-1 max-w-[20%] transition-all duration-300 transform',
                'hover:scale-105 active:scale-95',
                active 
                  ? 'text-primary bg-primary/15 shadow-sm' 
                  : isHighlighted
                    ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <div className={cn(
                'relative transition-all duration-300',
                active && 'scale-110',
                hasPulse && 'animate-pulse'
              )}>
                <Icon className={cn(
                  'transition-all duration-300',
                  active ? 'w-6 h-6' : 'w-5 h-5'
                )} />
                
                {/* Badge amélioré */}
                {item.badge && (
                  <Badge className={cn(
                    'absolute -top-2 -right-2 h-4 w-4 p-0 text-[10px] rounded-full flex items-center justify-center min-w-[16px] font-bold',
                    'shadow-md border-2 border-background',
                    hasPulse ? 'bg-red-500 animate-bounce' : 'bg-primary'
                  )}>
                    {item.badge > 99 ? '99+' : item.badge > 9 ? '9+' : item.badge}
                  </Badge>
                )}
                
                {/* Indicateur de priorité */}
                {isHighlighted && !active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                )}
              </div>
              
              <span className={cn(
                'text-[10px] font-medium leading-tight transition-all duration-300',
                active ? 'font-semibold text-primary' : 'text-current'
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
        
        {/* Menu burger amélioré */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                'flex flex-col gap-1 p-2 flex-1 max-w-[20%] rounded-xl transition-all duration-300',
                'hover:scale-105 active:scale-95 hover:bg-muted/50'
              )}
            >
              <div className="relative">
                <Menu className="w-5 h-5" />
                {(unreadCount > 0 || !user) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse shadow-sm" />
                )}
              </div>
              <span className="text-[10px] font-medium leading-tight">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[75vh] max-w-full rounded-t-3xl border-t-4 border-primary/20">
            <div className="space-y-6 pt-6 max-w-full">
              {/* En-tête amélioré */}
              <div className="text-center relative">
                <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Menu COREEGAB
                </h3>
                {user && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {profile?.role?.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {profile?.name}
                    </span>
                  </div>
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
                // Utilisateur connecté: Contenu spécialisé par rôle
                <>
                  {/* Sections spécialisées selon le rôle */}
                  {profile?.role === 'client' && (
                    <>
                      {/* Actions rapides client */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          Actions rapides
                    </h4>
                    
                        <div className="grid grid-cols-2 gap-3">
                        <NavLink
                          to="/calculator"
                          onClick={() => setIsMenuOpen(false)}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                            <Calculator className="w-6 h-6 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">Calculateur</span>
                        </NavLink>
                          
                        <NavLink
                            to="/client-dashboard?view=orders"
                          onClick={() => setIsMenuOpen(false)}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors relative"
                          >
                            <Package className="w-6 h-6 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Commandes</span>
                            {unreadCount > 0 && (
                              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                                {unreadCount}
                              </Badge>
                            )}
                        </NavLink>
                        </div>
                      </div>
                      </>
                    )}
                    
                    {profile?.role === 'admin' && (
                      <>
                      {/* Tableau de bord admin */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Administration
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                        <NavLink
                            to="/admin-dashboard?tab=orders"
                          onClick={() => setIsMenuOpen(false)}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors relative"
                          >
                            <Package className="w-6 h-6 text-red-600" />
                            <span className="text-sm font-medium text-red-700">Commandes</span>
                            {stats.pending > 0 && (
                              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 animate-pulse">
                                {stats.pending}
                              </Badge>
                            )}
                        </NavLink>
                          
                        <NavLink
                            to="/admin-dashboard?tab=analytics"
                          onClick={() => setIsMenuOpen(false)}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                        >
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">Analytics</span>
                        </NavLink>
                        </div>
                      </div>
                      </>
                    )}
                    
                    {profile?.role === 'commercial' && (
                      <>
                      {/* Outils commercial */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Outils de vente
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                        <NavLink
                            to="/commercial-dashboard?view=commission"
                          onClick={() => setIsMenuOpen(false)}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                        >
                            <DollarSign className="w-6 h-6 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Commission</span>
                        </NavLink>
                          
                        <NavLink
                            to="/commercial-dashboard?view=neworder"
                          onClick={() => setIsMenuOpen(false)}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                            <Plus className="w-6 h-6 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">Commande</span>
                        </NavLink>
                        </div>
                      </div>
                      </>
                    )}

                  {/* Navigation commune */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Navigation
                    </h4>
                    
                    <NavLink
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all duration-200 group"
                    >
                      <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Accueil</span>
                    </NavLink>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setTimeout(() => {
                          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all duration-200 w-full text-left group"
                    >
                      <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Services</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setTimeout(() => {
                          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all duration-200 w-full text-left group"
                    >
                      <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Mon compte
                    </h4>
                    
                    {/* Informations utilisateur */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{profile?.name}</p>
                          <p className="text-xs text-muted-foreground">{profile?.email}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {profile?.role?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Bouton de déconnexion */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center justify-center gap-3 p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-all duration-200 w-full text-red-700 font-medium group"
                    >
                      <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
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