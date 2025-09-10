import React from 'react';
import { Navigation } from '@/components/Navigation';
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

import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

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
    <SidebarProvider>
      <div className="min-h-screen w-full">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="text-foreground font-bold text-xl">COREGAB</span>
            </div>
            <div className="flex items-center gap-2">
              <CurrencySwitcher />
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 lg:pl-0">
            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <Navigation />
            </div>
            <main className="pt-20 lg:pt-0">
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
      </div>
    </SidebarProvider>
  );
};

export default Index;
