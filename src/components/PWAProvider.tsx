import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePlatformDetection } from '@/hooks/usePlatformDetection';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useToast } from '@/hooks/use-toast';

interface PWAContextType {
  isOnline: boolean;
  isUpdateAvailable: boolean;
  updateApp: () => void;
  platform: ReturnType<typeof usePlatformDetection>;
  install: ReturnType<typeof usePWAInstall>;
}

const PWAContext = createContext<PWAContextType | null>(null);

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

interface PWAProviderProps {
  children: React.ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  
  const platform = usePlatformDetection();
  const install = usePWAInstall();
  const { toast } = useToast();

  // Gestion du statut en ligne/hors ligne
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connexion rétablie",
        description: "Vous êtes de nouveau en ligne.",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Mode hors-ligne",
        description: "Certaines fonctionnalités peuvent être limitées.",
        variant: "destructive",
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Gestion des mises à jour du Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Enregistrer le Service Worker
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration);
          
          // Vérifier s'il y a une mise à jour en attente
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setIsUpdateAvailable(true);
          }

          // Écouter les nouvelles mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setWaitingWorker(newWorker);
                  setIsUpdateAvailable(true);
                  
                  toast({
                    title: "Mise à jour disponible",
                    description: "Une nouvelle version de l'application est prête.",
                    action: (
                      <button
                        onClick={updateApp}
                        className="text-sm underline text-primary"
                      >
                        Mettre à jour
                      </button>
                    ),
                    duration: 10000,
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });

      // Écouter les messages du Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          setIsUpdateAvailable(true);
        }
      });

      // Gérer les changements de contrôleur
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, [toast]);

  // Fonction pour mettre à jour l'application
  const updateApp = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setIsUpdateAvailable(false);
      setWaitingWorker(null);
    }
  };

  const value: PWAContextType = {
    isOnline,
    isUpdateAvailable,
    updateApp,
    platform,
    install,
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
};