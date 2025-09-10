import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Loader2 } from 'lucide-react';

export default function PhoneAuth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { user, profile, loading } = useAuth();

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Rediriger si l'utilisateur est déjà connecté
  if (user && profile) {
    const dashboardRoutes = {
      client: '/client-dashboard',
      commercial: '/commercial-dashboard',
      admin: '/admin-dashboard',
    };
    
    return <Navigate to={dashboardRoutes[profile.role]} replace />;
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Image de fond de l'application */}
      <div className="absolute inset-0">
        <img
          src="/coregab-accueil.JPG"
          alt="COREGAB - Import Corée-Gabon"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Overlay adaptatif selon le thème */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40 dark:from-black/90 dark:via-black/70 dark:to-black/50" />
      </div>

      {/* Bouton de basculement de thème */}
      <div className="absolute top-6 right-6 z-20">
        <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-full p-1">
          <ThemeToggle />
        </div>
      </div>

      {/* Layout en deux colonnes sur desktop, simple sur mobile */}
      <div className="relative z-10 min-h-screen">
        <div className="grid lg:grid-cols-2 min-h-screen">
          
          {/* Colonne gauche - Branding et informations (cachée sur mobile) */}
          <div className="hidden lg:flex flex-col justify-center p-12 xl:p-16">
            <div className="max-w-lg">
              {/* Logo et titre */}
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png" 
                  alt="COREGAB Logo" 
                  className="w-16 h-16 drop-shadow-2xl"
                />
                <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
                  COREGAB
                </h1>
              </div>

              {/* Slogan principal */}
              <h2 className="text-3xl xl:text-4xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
                Importez depuis la{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Corée du Sud
                </span>
              </h2>

              {/* Description */}
              <p className="text-xl text-white/90 mb-8 leading-relaxed drop-shadow-lg">
                Plateforme complète d'import de produits coréens avec assistance IA,
                calcul de prix en temps réel et gestion commerciale intégrée.
              </p>

              {/* Points forts */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-lg">Calcul automatique des prix transport et douanes</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-lg">Assistance IA pour la recherche de produits</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-lg">Gestion complète des commandes</span>
                </div>
              </div>

              {/* Indicateur de service */}
              <div className="mt-8 flex items-center gap-3 text-white/80">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-lg font-medium">Service disponible 24h/24</span>
              </div>
            </div>
          </div>

          {/* Colonne droite - Formulaire de connexion */}
          <div className="flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-md">
              
              {/* Header mobile (visible uniquement sur mobile) */}
              <div className="lg:hidden text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <img 
                    src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png" 
                    alt="COREGAB Logo" 
                    className="w-12 h-12 drop-shadow-lg"
                  />
                  <h1 className="text-3xl font-bold text-white drop-shadow-2xl">
                    COREGAB
                  </h1>
                </div>
                <p className="text-white/90 text-lg font-medium drop-shadow-lg">
                  Votre plateforme d'import depuis la Corée du Sud
                </p>
              </div>

              {/* Formulaire avec effet de verre premium */}
              <div className="backdrop-blur-xl bg-white/5 dark:bg-black/10 rounded-2xl border border-white/10 dark:border-white/5 shadow-2xl">
                {mode === 'login' ? (
                  <LoginForm onToggleMode={toggleMode} />
                ) : (
                  <SignupForm onToggleMode={toggleMode} />
                )}
              </div>

              {/* Footer informations */}
              <div className="mt-6 text-center space-y-4">
                <p className="text-sm text-white/70">
                  En vous connectant, vous acceptez nos{' '}
                  <a href="#" className="underline hover:text-blue-300 transition-colors">
                    conditions d'utilisation
                  </a>
                  {' '}et notre{' '}
                  <a href="#" className="underline hover:text-blue-300 transition-colors">
                    politique de confidentialité
                  </a>
                </p>
                
                {/* Badges de confiance */}
                <div className="flex items-center justify-center gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span>Sécurisé SSL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>Données protégées</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span>Support 24h/24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}