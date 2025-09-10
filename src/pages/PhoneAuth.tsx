import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="/lovable-uploads/ff7ce1b8-d2a2-4701-acda-806f793d401b.png" 
              alt="COREGAB Logo" 
              className="w-12 h-12"
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              COREGAB
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Votre plateforme d'import depuis la Corée du Sud
          </p>
        </div>

        {mode === 'login' ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <SignupForm onToggleMode={toggleMode} />
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            En vous connectant, vous acceptez nos{' '}
            <a href="#" className="underline hover:text-primary">
              conditions d'utilisation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}