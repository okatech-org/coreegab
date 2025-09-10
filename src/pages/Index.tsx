import React from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { PriceCalculator } from '@/components/PriceCalculator';
import { CategoriesSection } from '@/components/CategoriesSection';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { Footer } from '@/components/Footer';
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
      description: "Fonctionnalité en cours de développement. Restez connecté !",
    });
    
    // In a real app, this would redirect to the appropriate dashboard
    console.log(`Demo login as ${role}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onDemoLogin={handleDemoLogin} />
      <HeroSection onDemoLogin={handleDemoLogin} />
      <PriceCalculator />
      <CategoriesSection />
      <ProcessTimeline />
      <Footer />
    </div>
  );
};

export default Index;
