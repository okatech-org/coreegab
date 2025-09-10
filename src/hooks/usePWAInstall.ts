import { useState, useEffect, useCallback } from 'react';
import { usePlatformDetection } from './usePlatformDetection';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  showInstallPrompt: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  installApp: () => Promise<boolean>;
  dismissPrompt: () => void;
  showIOSInstructions: () => void;
  hideIOSInstructions: () => void;
  showAndroidInstructions: () => void;
  hideAndroidInstructions: () => void;
}

export const usePWAInstall = (): PWAInstallState => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  
  const platform = usePlatformDetection();

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    setIsInstalled(platform.isStandalone);
    
    // Écouter l'événement beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallPrompt(e);
      setCanInstall(true);
      
      // Afficher le prompt après un délai ou certaines conditions
      setTimeout(() => {
        if (!platform.isStandalone && shouldShowInstallPrompt()) {
          setShowInstallPrompt(true);
        }
      }, 5000); // Attendre 5 secondes après le chargement
    };

    // Écouter l'installation de l'app
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setShowInstallPrompt(false);
      setInstallPrompt(null);
      
      // Sauvegarder que l'app a été installée
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [platform.isStandalone]);

  // Vérifier si on doit afficher le prompt d'installation
  const shouldShowInstallPrompt = useCallback((): boolean => {
    // Ne pas afficher si déjà installé
    if (platform.isStandalone || localStorage.getItem('pwa-installed') === 'true') {
      return false;
    }
    
    // Ne pas afficher si l'utilisateur a déjà refusé
    if (localStorage.getItem('pwa-prompt-dismissed') === 'true') {
      return false;
    }
    
    // Afficher seulement après plusieurs visites
    const visitCount = parseInt(localStorage.getItem('visit-count') || '0') + 1;
    localStorage.setItem('visit-count', visitCount.toString());
    
    return visitCount >= 3; // Afficher après 3 visites
  }, [platform.isStandalone]);

  // Installer l'application (Android/Chrome)
  const installApp = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) {
      // Pour iOS, afficher les instructions
      if (platform.isIOS) {
        setShowIOSModal(true);
        return false;
      }
      
      // Pour Android sans prompt, afficher les instructions
      if (platform.isAndroid) {
        setShowAndroidModal(true);
        return false;
      }
      
      return false;
    }

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setCanInstall(false);
        setShowInstallPrompt(false);
        return true;
      } else {
        // L'utilisateur a refusé, ne plus afficher le prompt
        localStorage.setItem('pwa-prompt-dismissed', 'true');
        setShowInstallPrompt(false);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
      return false;
    }
  }, [installPrompt, platform.isIOS, platform.isAndroid]);

  // Fermer le prompt d'installation
  const dismissPrompt = useCallback(() => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  }, []);

  // Afficher/masquer les instructions iOS
  const showIOSInstructions = useCallback(() => {
    setShowIOSModal(true);
  }, []);

  const hideIOSInstructions = useCallback(() => {
    setShowIOSModal(false);
  }, []);

  // Afficher/masquer les instructions Android
  const showAndroidInstructions = useCallback(() => {
    setShowAndroidModal(true);
  }, []);

  const hideAndroidInstructions = useCallback(() => {
    setShowAndroidModal(false);
  }, []);

  return {
    canInstall: canInstall || platform.isIOS || platform.isAndroid,
    isInstalled,
    showInstallPrompt,
    installPrompt,
    installApp,
    dismissPrompt,
    showIOSInstructions,
    hideIOSInstructions,
    showAndroidInstructions,
    hideAndroidInstructions,
  };
};