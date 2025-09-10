import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Zap, Shield } from 'lucide-react';

interface HeroSectionProps {
  onDemoLogin?: (role: 'client' | 'commercial' | 'admin') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onDemoLogin }) => {
  return (
    <section className="pt-6 lg:pt-32 pb-12 lg:pb-20 px-4 lg:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold text-foreground mb-4 lg:mb-6 leading-tight px-2">
            Importez depuis la{' '}
            <span className="gradient-text">Corée du Sud</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 lg:mb-8 px-4 leading-relaxed">
            Plateforme complète d'import de produits coréens avec assistance IA, 
            calcul de prix en temps réel et gestion commerciale intégrée.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto">
            <Button size="lg" className="text-sm sm:text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 w-full sm:w-auto">
              Commencer maintenant
              <ArrowRight className="ml-2 w-4 lg:w-5 h-4 lg:h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-sm sm:text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 w-full sm:w-auto">
              Voir la démo
            </Button>
          </div>
        </div>

        {/* Hero image or visual element */}
        <div className="mt-8 lg:mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-center mx-4 lg:mx-0">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">
              Votre partenaire de confiance pour l'import coréen
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
              Découvrez nos services complets dans la navigation pour commencer votre aventure d'import.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};