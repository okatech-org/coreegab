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
      <div className="absolute inset-0 w-full h-full">
        <img
          src={imageError ? "/src/assets/hero-image.jpg" : "/coregab-accueil.JPG"}
          alt="COREGAB - Votre spécialiste du marché coréen"
          className="w-full h-full object-cover object-center"
          loading="eager"
          onError={() => setImageError(true)}
        />
        {/* Overlay sombre pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/40"></div>
      </div>

      {/* Contenu superposé sur l'image - RESPONSIVE ADAPTATIF */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl text-center mx-auto">
          
          
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-tight drop-shadow-2xl px-2">
            Importez depuis la{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-none block sm:inline">
              Corée du Sud
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/95 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-relaxed drop-shadow-lg px-2 font-medium">
            Plateforme complète d'import de produits coréens avec assistance IA,
            calcul de prix en temps réel et gestion commerciale intégrée.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto px-2">
            {user ? (
              // Utilisateur connecté
              <>
                <Button 
                  size="default" 
                  className="text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5 lg:py-6 w-full sm:w-auto min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[250px] bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xl border-0 transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    const dashboardRoutes = {
                      client: '/client-dashboard',
                      commercial: '/commercial-dashboard',
                      admin: '/admin-dashboard',
                    };
                    navigate(dashboardRoutes[profile?.role || 'client']);
                  }}
                >
                  <User className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  Mon Dashboard
                </Button>
                
                <Button 
                  size="default" 
                  variant="outline" 
                  className="text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5 lg:py-6 w-full sm:w-auto min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[250px] bg-white/15 border-2 border-white/40 text-white hover:bg-white/25 backdrop-blur-md font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/boutique')}
                >
                  <Package className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  Boutique
                </Button>
              </>
            ) : (
              // Utilisateur non connecté
              <>
                <Button 
                  size="default" 
                  className="text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5 lg:py-6 w-full sm:w-auto min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[250px] bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xl border-0 transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  Se connecter
                </Button>
                
                <Button 
                  size="default" 
                  variant="outline" 
                  className="text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5 lg:py-6 w-full sm:w-auto min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[250px] bg-white/15 border-2 border-white/40 text-white hover:bg-white/25 backdrop-blur-md font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/boutique')}
                >
                  <Package className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
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