import React from 'react';
import { X, Smartphone, Download, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { usePlatformDetection } from '@/hooks/usePlatformDetection';

export const PWAInstallPrompt: React.FC = () => {
  const { 
    showInstallPrompt, 
    canInstall, 
    isInstalled,
    installApp, 
    dismissPrompt 
  } = usePWAInstall();
  
  const platform = usePlatformDetection();

  // Ne rien afficher si l'app est déjà installée
  if (isInstalled || !canInstall) {
    return null;
  }

  const getInstallInstructions = () => {
    if (platform.isIOS) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <Share className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                1. Appuyez sur l'icône Partager
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                En bas de votre écran Safari
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <Plus className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">
                2. Sélectionnez "Sur l'écran d'accueil"
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Faites défiler et trouvez cette option
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <Smartphone className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-purple-900 dark:text-purple-100">
                3. Confirmez l'ajout
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                L'app apparaîtra sur votre écran d'accueil
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (platform.isAndroid) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="w-6 h-6 flex items-center justify-center bg-blue-600 rounded text-white text-xs font-bold">
              ⋮
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                1. Ouvrez le menu Chrome
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Les trois points en haut à droite
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <Download className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">
                2. Sélectionnez "Installer l'application"
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Ou "Ajouter à l'écran d'accueil"
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <Smartphone className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-purple-900 dark:text-purple-100">
                3. Confirmez l'installation
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                L'app sera installée comme une app native
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <Dialog open={showInstallPrompt} onOpenChange={() => dismissPrompt()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              Installer COREEGAB
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissPrompt}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Installez COREEGAB sur votre {platform.isMobile ? 'téléphone' : 'ordinateur'} pour une expérience optimale :
          </p>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Accès rapide</p>
              <p className="text-xs text-muted-foreground">Depuis l'écran d'accueil</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">Mode hors-ligne</p>
              <p className="text-xs text-muted-foreground">Fonctionne sans internet</p>
            </div>
          </div>
          
          {platform.isIOS || platform.isAndroid ? (
            <>
              {getInstallInstructions()}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={dismissPrompt} className="flex-1">
                  Plus tard
                </Button>
                <Button onClick={() => installApp()} className="flex-1">
                  Compris !
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={dismissPrompt} className="flex-1">
                Plus tard
              </Button>
              <Button onClick={() => installApp()} className="flex-1">
                Installer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};