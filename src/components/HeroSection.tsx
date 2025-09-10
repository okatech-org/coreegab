import React from 'react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';
import { User, Briefcase, Settings as SettingsIcon } from 'lucide-react';

interface HeroSectionProps {
  onDemoLogin?: (role: 'client' | 'commercial' | 'admin') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onDemoLogin }) => {
  return (
    <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-background via-background to-muted/50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Importez facilement vos produits de{' '}
              <span className="gradient-text">Corée</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Véhicules, électronique, électroménager - Nous gérons transport, douanes et livraison pour vous
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="xl"
                className="flex items-center gap-2"
                onClick={() => window.location.href = '/auth'}
              >
                <User className="w-5 h-5" />
                Se connecter
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="flex items-center gap-2"
                onClick={() => window.location.href = '/boutique'}
              >
                <Briefcase className="w-5 h-5" />
                Découvrir la boutique
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              ✨ Accès démo disponible sur la page de connexion
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Produits coréens - électronique, véhicules, électroménager"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};