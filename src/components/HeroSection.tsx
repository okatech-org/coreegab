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

        {/* Features highlight */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Import Simplifié</h3>
            <p className="text-muted-foreground">
              Catalogue complet de produits coréens avec processus d'import optimisé
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">IA Commerciale</h3>
            <p className="text-muted-foreground">
              Assistant intelligent pour vos besoins commerciaux et recommandations
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Calcul Précis</h3>
            <p className="text-muted-foreground">
              Estimation en temps réel des coûts d'import et frais douaniers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};