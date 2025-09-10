import React from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { PriceCalculator } from '@/components/PriceCalculator';
import { CategoriesSection } from '@/components/CategoriesSection';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { Footer } from '@/components/Footer';
import DemoLogin from '@/components/DemoLogin';
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
    <div className="min-h-screen bg-background">
      <Navigation onDemoLogin={handleDemoLogin} />
      <HeroSection onDemoLogin={handleDemoLogin} />
      <PriceCalculator />
      <CategoriesSection />
      <DemoLogin onDemoLogin={handleDemoLogin} />
      <ProcessTimeline />
      <Footer />
    </div>
  );
};

export default Index;
