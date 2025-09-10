import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Zap, Shield } from 'lucide-react';

interface HeroSectionProps {
  onDemoLogin?: (role: 'client' | 'commercial' | 'admin') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onDemoLogin }) => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Importez depuis la{' '}
            <span className="gradient-text">Corée du Sud</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Plateforme complète d'import de produits coréens avec assistance IA, 
            calcul de prix en temps réel et gestion commerciale intégrée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              Commencer maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Voir la démo
            </Button>
          </div>
        </div>

        {/* Hero image or visual element */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Votre partenaire de confiance pour l'import coréen
            </h3>
            <p className="text-muted-foreground text-lg">
              Découvrez nos services complets dans la navigation pour commencer votre aventure d'import.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};