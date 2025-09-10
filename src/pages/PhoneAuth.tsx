import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Home } from 'lucide-react';

export default function PhoneAuth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

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
    <div className="auth-page min-h-screen relative overflow-hidden">
      {/* Image de fond de l'application */}
      <div className="absolute inset-0">
        <img
          src="/coregab-accueil.JPG"
          alt="COREGAB - Import Corée-Gabon"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Overlay optimisé pour voir les personnes */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/20 dark:from-black/80 dark:via-black/60 dark:to-black/40" />
      </div>

      {/* Boutons de navigation et thème */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
        {/* Bouton retour à l'accueil */}
        <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-full p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Bouton de basculement de thème */}
        <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-full p-1">
          <ThemeToggle />
        </div>
      </div>

      {/* Layout centré sur desktop pour voir l'image de fond */}
      <div className="relative z-10 min-h-screen">
        

        {/* Formulaire centré avec design adaptatif */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            
            {/* Header mobile compact */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img 
                  src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png" 
                  alt="COREGAB Logo" 
                  className="w-12 h-12 drop-shadow-lg"
                />
                <h1 className="text-3xl font-bold text-white drop-shadow-2xl">
                  COREGAB
                </h1>
              </div>
            </div>

            {/* Bloc de connexion adaptatif selon le thème */}
            <div className="relative">
              {/* Fond adaptatif selon le thème avec effet de verre */}
              <div className="absolute inset-0 rounded-2xl bg-white/95 dark:bg-black/90 backdrop-blur-xl border border-white/30 dark:border-white/15 shadow-2xl glass-effect" />
              
              {/* Contenu du formulaire */}
              <div className="relative z-10 p-1">
                {mode === 'login' ? (
                  <LoginForm onToggleMode={toggleMode} />
                ) : (
                  <SignupForm onToggleMode={toggleMode} />
                )}
              </div>

              {/* Footer minimal dans le bloc */}
              <div className="relative z-10 px-6 pb-6">
                <p className="text-xs text-muted-foreground text-center">
                  En vous connectant, vous acceptez nos{' '}
                  <a href="#" className="underline hover:text-primary transition-colors">
                    conditions d'utilisation
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}