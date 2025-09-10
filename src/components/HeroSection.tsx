import React from 'react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';
import coregabLogo from '@/assets/coregab-logo-transparent.png';
import { User, Briefcase, Settings as SettingsIcon, ShoppingBag } from 'lucide-react';

interface HeroSectionProps {
  onDemoLogin?: (role: 'client' | 'commercial' | 'admin') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onDemoLogin }) => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <img 
              src={coregabLogo} 
              alt="COREGAB" 
              className="h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Que souhaitez-vous{' '}
            <span className="gradient-text">créer ?</span>
          </h1>
        </div>
        
        {/* Feature Cards Grid - OpenArt Style */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Import Card - Blue */}
          <div className="card-feature" onClick={() => window.location.href = '/boutique'}>
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Import</h3>
              <p className="text-white/80">Importez vos produits coréens facilement</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-black/20 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Boutique
              </div>
              <div className="bg-black/20 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                Calculateur
              </div>
            </div>
          </div>

          {/* IA Commercial Card - Yellow */}
          <div className="card-feature yellow" onClick={() => window.location.href = '/commercial-dashboard'}>
            <div className="mb-6">
              <div className="w-16 h-16 bg-black/10 rounded-xl flex items-center justify-center mb-4 relative">
                <User className="w-8 h-8 text-black" />
                <div className="absolute -top-1 -right-1 bg-black text-white text-xs px-2 py-1 rounded-full">
                  Generating
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">IA Commercial</h3>
              <p className="text-black/70">Assistant commercial intelligent</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Agent IA
              </div>
              <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Chat Commercial
              </div>
            </div>
          </div>
        </div>

        {/* Quick Starts Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8">Quick starts</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
            <div 
              className="bg-card border border-border rounded-xl p-6 hover:bg-card/80 transition-colors cursor-pointer"
              onClick={() => window.location.href = '/client-dashboard'}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Accès Client</h3>
                  <p className="text-sm text-muted-foreground">Gérez vos commandes et suivez vos importations</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-card border border-border rounded-xl p-6 hover:bg-card/80 transition-colors cursor-pointer"
              onClick={() => window.location.href = '/admin-dashboard'}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <SettingsIcon className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Panel Admin</h3>
                  <p className="text-sm text-muted-foreground">Administration complète de la plateforme</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};