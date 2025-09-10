import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Zap, Shield, User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onDemoLogin?: (role: 'client' | 'commercial' | 'admin') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onDemoLogin }) => {
  const [imageError, setImageError] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Image de fond pleine largeur */}
      <div className="absolute inset-0">
        <img 
          src={imageError ? "/src/assets/hero-image.jpg" : "/coregab-accueil.JPG"}
          alt="COREGAB - Votre spécialiste du marché coréen" 
          className="w-full h-full object-cover object-center"
          loading="eager"
          onError={() => setImageError(true)}
        />
        {/* Overlay sombre pour améliorer la lisibilité du texte - Plus intense en haut */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/30"></div>
      </div>

      {/* Contenu superposé sur l'image - Ajustement de position */}
      <div className="relative z-10 flex items-start justify-center min-h-screen pt-16 lg:pt-20 px-4 lg:px-6">
        <div className="container mx-auto max-w-6xl text-center mt-16 lg:mt-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-5 leading-tight px-2 drop-shadow-2xl">
            Importez depuis la{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-none">
              Corée du Sud
            </span>
          </h1>
          
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/95 max-w-3xl mx-auto mb-12 lg:mb-16 px-4 leading-relaxed drop-shadow-lg font-medium">
            Plateforme complète d'import de produits coréens avec assistance IA, 
            calcul de prix en temps réel et gestion commerciale intégrée.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center px-4 max-w-lg sm:max-w-none mx-auto mt-4 lg:mt-8">
            {user ? (
              // Utilisateur connecté
              <>
                <Button 
                  size="lg" 
                  className="text-base sm:text-lg lg:text-xl px-8 lg:px-12 py-4 lg:py-6 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xl border-0 transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    const dashboardRoutes = {
                      client: '/client-dashboard',
                      commercial: '/commercial-dashboard',
                      admin: '/admin-dashboard',
                    };
                    navigate(dashboardRoutes[profile?.role || 'client']);
                  }}
                >
                  <User className="mr-3 w-5 h-5 lg:w-6 lg:h-6" />
                  Mon Dashboard
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base sm:text-lg lg:text-xl px-8 lg:px-12 py-4 lg:py-6 w-full sm:w-auto bg-white/15 border-2 border-white/40 text-white hover:bg-white/25 backdrop-blur-md font-semibold shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/boutique')}
                >
                  <Package className="mr-3 w-5 h-5 lg:w-6 lg:h-6" />
                  Boutique
                </Button>
              </>
            ) : (
              // Utilisateur non connecté
              <>
                <Button 
                  size="lg" 
                  className="text-base sm:text-lg lg:text-xl px-8 lg:px-12 py-4 lg:py-6 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xl border-0 transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn className="mr-3 w-5 h-5 lg:w-6 lg:h-6" />
                  Se connecter
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base sm:text-lg lg:text-xl px-8 lg:px-12 py-4 lg:py-6 w-full sm:w-auto bg-white/15 border-2 border-white/40 text-white hover:bg-white/25 backdrop-blur-md font-semibold shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/boutique')}
                >
                  <Package className="mr-3 w-5 h-5 lg:w-6 lg:h-6" />
                  Découvrir
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};