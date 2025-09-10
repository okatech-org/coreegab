import React from 'react';
import { Download, Smartphone, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { usePlatformDetection } from '@/hooks/usePlatformDetection';
import { useToast } from '@/hooks/use-toast';

interface PWAInstallButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const { canInstall, isInstalled, installApp } = usePWAInstall();
  const platform = usePlatformDetection();
  const { toast } = useToast();

  // Ne rien afficher si l'app est déjà installée ou ne peut pas être installée
  if (isInstalled || !canInstall) {
    return null;
  }

  const handleInstall = async () => {
    if (platform.isIOS) {
      toast({
        title: "Installation sur iOS",
        description: (
          <div className="space-y-2">
            <p>Pour installer COREGAB sur iOS :</p>
            <div className="flex items-center gap-2 text-sm">
              <Share className="w-4 h-4" />
              <span>1. Appuyez sur l'icône Partager</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              <span>2. Sélectionnez "Sur l'écran d'accueil"</span>
            </div>
          </div>
        ),
        duration: 8000,
      });
      return;
    }

    if (platform.isAndroid) {
      const success = await installApp();
      if (!success) {
        toast({
          title: "Installation sur Android",
          description: (
            <div className="space-y-2">
              <p>Pour installer COREGAB :</p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 flex items-center justify-center bg-muted rounded text-xs">⋮</div>
                <span>1. Menu Chrome (3 points)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                <span>2. "Installer l'application"</span>
              </div>
            </div>
          ),
          duration: 8000,
        });
      }
      return;
    }

    // Pour les autres plateformes (desktop Chrome, etc.)
    const success = await installApp();
    if (success) {
      toast({
        title: "Installation réussie !",
        description: "COREGAB a été installé avec succès.",
      });
    }
  };

  const getButtonText = () => {
    if (platform.isIOS) return "Instructions iOS";
    if (platform.isAndroid) return "Installer";
    return "Installer l'app";
  };

  const getButtonIcon = () => {
    if (platform.isIOS) return <Share className="w-4 h-4" />;
    if (platform.isMobile) return <Smartphone className="w-4 h-4" />;
    return <Download className="w-4 h-4" />;
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleInstall}
      className={`flex items-center gap-2 ${className}`}
    >
      {getButtonIcon()}
      {getButtonText()}
    </Button>
  );
};