import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { PriceCalculator } from '@/components/PriceCalculator';
import { CategoriesSection } from '@/components/CategoriesSection';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { ServicesSection } from '@/components/ServicesSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { Button } from '@/components/ui/button';
import { User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { cn } from '@/lib/utils';

const Index = () => {
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const mobile = useMobileOptimizations();

  const handleDemoLogin = (role: 'client' | 'commercial' | 'admin') => {
    // Store demo session
    localStorage.setItem('userRole', role);
    localStorage.setItem('isDemo', 'true');
    
    // Show success toast
    toast({
      title: `Accès Démo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      description: "Redirection vers votre dashboard...",
    });
    
    // Redirect to appropriate dashboard
    const routes = {
      client: '/client-dashboard',
      commercial: '/commercial-dashboard',
      admin: '/admin-dashboard'
    };
    
    setTimeout(() => {
      window.location.href = routes[role];
    }, 1000);
  };

  return (
    <>
      <SEO />
      <SidebarProvider>
        <div className="min-h-screen w-full">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="p-2 hover:bg-muted rounded-md" />
              <div className="flex items-center gap-1">
                <img 
                  src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png" 
                  alt="COREGAB Logo" 
                  className="w-11 h-11"
                />
                <span className="text-foreground font-bold text-2xl">COREGAB</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PWAInstallButton variant="ghost" size="sm" />
              <ThemeToggle />
              <CurrencySwitcher />
              <LanguageSwitcher />
              
              {/* Indicateur de connexion */}
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
                  >
                    <User className="h-4 w-4 mr-1" />
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Se connecter
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="flex min-h-screen">
          {!mobile.isMobile && <AppSidebar />}
          <div className="flex-1">
            <main className={cn(
              mobile.isMobile ? 'pt-16 pb-20' : 'pt-16 lg:pt-0'
            )}>
              <HeroSection />
              <PriceCalculator />
              <CategoriesSection />
              <ProcessTimeline />
              <ServicesSection />
              <ContactSection />
              <Footer />
            </main>
          </div>
        </div>
        
        {/* Navigation mobile */}
        {mobile.isMobile && <MobileNavigation />}
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
      </div>
      </SidebarProvider>
    </>
  );
};

export default Index;
