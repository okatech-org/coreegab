import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMonitoring } from '@/lib/monitoring';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { 
  Home, 
  ShoppingBag, 
  CreditCard, 
  Search, 
  Bot, 
  Phone,
  User, 
  Users, 
  Settings, 
  LogOut,
  ShoppingCart,
  Heart,
  Package,
  BarChart3,
  MessageSquare,
  Calculator
} from 'lucide-react';

export const NewVerticalMenu: React.FC = () => {
  const { t } = useLanguage();
  const { user, profile, signOut, signInDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useMonitoring();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState<string | null>(null);

  const mainItems = [
    { title: t('sidebar.home'), icon: Home, url: '/' },
    { title: t('sidebar.shop'), icon: ShoppingBag, url: '/boutique' },
    { title: t('sidebar.calculator'), icon: Calculator, url: '/calculator' },
    { title: t('sidebar.aiSearch'), icon: Search, url: '/ai-search' },
    { title: t('sidebar.commercialChat'), icon: Bot, url: '/commercial-chat' },
  ];

  const getRoleSpecificItems = () => {
    if (!user) return [];
    switch (profile?.role) {
      case 'client':
        return [
          { title: t('sidebar.myDashboard'), icon: BarChart3, url: '/client-dashboard' },
          { title: t('sidebar.myOrders'), icon: Package, url: '/client-dashboard?view=orders' },
          { title: t('sidebar.myFavorites'), icon: Heart, url: '/client-dashboard?view=favorites' },
          { title: t('sidebar.myProfile'), icon: User, url: '/client-dashboard?view=profile' },
        ];
      case 'commercial':
        return [
          { title: t('sidebar.commercialDashboard'), icon: BarChart3, url: '/commercial-dashboard' },
          { title: t('sidebar.clients'), icon: Users, url: '/commercial-dashboard?view=clients' },
          { title: t('sidebar.orders'), icon: Package, url: '/commercial-dashboard?view=orders' },
          { title: t('sidebar.messages'), icon: MessageSquare, url: '/commercial-dashboard?view=messages' },
        ];
      case 'admin':
        return [
          { title: t('sidebar.adminDashboard'), icon: BarChart3, url: '/admin-dashboard' },
          { title: t('sidebar.users'), icon: Users, url: '/admin-dashboard?view=users' },
          { title: t('sidebar.products'), icon: ShoppingBag, url: '/admin-dashboard?view=products' },
          { title: t('sidebar.orders'), icon: Package, url: '/admin-dashboard?view=orders' },
          { title: t('sidebar.settings'), icon: Settings, url: '/admin-dashboard?view=settings' },
        ];
      default:
        return [];
    }
  };

  const demoItems = [
    { role: 'client', label: t('sidebar.demoClient'), icon: User },
    { role: 'commercial', label: t('sidebar.demoCommercial'), icon: Users },
    { role: 'admin', label: t('sidebar.demoAdmin'), icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleDemoLogin = async (role: 'client' | 'commercial' | 'admin') => {
    setIsDemoLoading(role);
    trackEvent('demo_login_clicked', { role });
    
    try {
      await signInDemo(role);
      
      toast({
        title: `Connexion démo ${role}`,
        description: "Redirection vers votre dashboard...",
      });

      // Redirect after successful login
      const routes = {
        client: '/client-dashboard',
        commercial: '/commercial-dashboard',
        admin: '/admin-dashboard'
      };
      
      setTimeout(() => {
        navigate(routes[role]);
      }, 1000);

    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter en mode démo",
        variant: "destructive",
      });
    } finally {
      setIsDemoLoading(null);
    }
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    trackEvent('logout_clicked', { role: profile?.role });
    
    try {
      await signOut();
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });

      navigate('/');
      
    } catch (error) {
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="floating-vertical-menu floating-vertical-menu-light">
      <div className="flex flex-col h-full p-4">
        
        {/* Logo */}
        <div className="mb-6 px-2">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png"
              alt="COREEGAB Logo"
              className="w-8 h-8"
            />
            <span className="text-foreground font-bold text-xl">COREEGAB</span>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 space-y-2">
          <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3 px-2">
            {t('sidebar.main')}
          </h3>
          
          {mainItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive: active }) => 
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  active || isActive(item.url)
                    ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">{item.title}</span>
            </NavLink>
          ))}

          {/* Navigation spécifique au rôle */}
          {user && getRoleSpecificItems().length > 0 && (
            <>
              <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mt-6 mb-3 px-2">
                {t('sidebar.mySpace')}
              </h3>
              {getRoleSpecificItems().map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive: active }) => 
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{item.title}</span>
                </NavLink>
              ))}
            </>
          )}

          {/* Comptes démo */}
          {!user && (
            <>
              <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mt-6 mb-3 px-2">
                {t('sidebar.demoAccounts')}
              </h3>
              <div className="space-y-1">
                {demoItems.map((item) => (
                  <Button
                    key={item.role}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDemoLogin(item.role as 'client' | 'commercial' | 'admin')}
                    disabled={isDemoLoading === item.role}
                    className="w-full flex items-center justify-start gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 disabled:opacity-50"
                  >
                    {isDemoLoading === item.role ? (
                      <LoadingSpinner />
                    ) : (
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="whitespace-nowrap">
                      {isDemoLoading === item.role ? 'Connexion...' : item.label}
                    </span>
                  </Button>
                ))}
              </div>
            </>
          )}
        </nav>

        {/* Section utilisateur / Déconnexion */}
        {user && (
          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="flex items-center gap-3 mb-3 px-2">
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{profile?.name || 'Utilisateur'}</p>
                <Badge variant="outline" className="text-xs px-1 py-0 mt-1">
                  {profile?.role?.toUpperCase()}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-200 disabled:opacity-50"
              onClick={handleSignOut}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <LoadingSpinner />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              <span>{isLoggingOut ? 'Déconnexion...' : t('sidebar.logout')}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
