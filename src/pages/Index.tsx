import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { PriceCalculator } from '@/components/PriceCalculator';
import { CategoriesSection } from '@/components/CategoriesSection';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { ServicesSection } from '@/components/ServicesSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { MobileHeader } from '@/components/mobile/MobileHeader';
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
        <MobileHeader />

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
