import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { PriceCalculator } from '@/components/PriceCalculator';
import { CategoriesSection } from '@/components/CategoriesSection';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { ServicesSection } from '@/components/ServicesSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { NewVerticalMenu } from '@/components/NewVerticalMenu';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { DesktopFloatingHeader } from '@/components/DesktopFloatingHeader';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { cn } from '@/lib/utils';

const IndexContent = () => {
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

  // Structure mobile
  if (mobile.isMobile) {
    return (
      <div className="min-h-screen w-full bg-background">
        {/* Header mobile flottant */}
        <div className="floating-mobile-header floating-mobile-header-light floating-element">
          <MobileHeader />
        </div>

        {/* Contenu principal mobile */}
        <main className="pt-20 pb-24 min-h-screen">
          <HeroSection />
          <PriceCalculator />
          <CategoriesSection />
          <ProcessTimeline />
          <ServicesSection />
          <ContactSection />
          <Footer />
        </main>
    
        
        <PWAInstallPrompt />
      </div>
    );
  }

  // Structure desktop avec nouveau menu vertical
  return (
    <div className="min-h-screen w-full">
      {/* Menu vertical flottant desktop */}
      <div className="fixed top-4 left-4 bottom-4 z-50 hidden lg:block">
        <NewVerticalMenu />
      </div>
      
      {/* Header flottant desktop */}
      <div className="fixed top-4 right-4 z-50 hidden lg:block">
        <DesktopFloatingHeader />
      </div>
      
      {/* Contenu principal desktop */}
      <main className="min-h-screen pt-4 lg:pl-[340px] lg:pr-8">
          <HeroSection />
          <PriceCalculator />
          <CategoriesSection />
          <ProcessTimeline />
          <ServicesSection />
          <ContactSection />
          <Footer />
        </main>
        
        <PWAInstallPrompt />
    </div>
  );
};

const Index = () => {
  return (
    <>
      <SEO />
      <IndexContent />
    </>
  );
};

export default Index;
