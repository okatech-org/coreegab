import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  LogOut, 
  Bell, 
  MessageCircle,
  ShoppingCart,
  LogIn
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export const DesktopFloatingHeader: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="floating-header floating-header-light">
      <div className="flex items-center justify-end gap-3 px-6 py-3">
        
        {/* Outils et paramètres */}
        <div className="flex items-center gap-2">
          <CurrencySwitcher />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Séparateur */}
        <div className="w-px h-6 bg-border/50" />

        {user ? (
          // Utilisateur connecté
          <>
            {/* Informations utilisateur */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{profile?.name || 'Utilisateur'}</span>
              </div>
              <Badge variant="outline" className="text-xs px-1 py-0">
                {profile?.role?.toUpperCase()}
              </Badge>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center gap-1">
              {/* Panier (si client) */}
              {profile?.role === 'client' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/boutique?view=cart')}
                  className="relative"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {getCartCount() > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] rounded-full flex items-center justify-center">
                      {getCartCount()}
                    </Badge>
                  )}
                </Button>
              )}

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Notifications",
                    description: "Système de notifications bientôt disponible",
                  });
                }}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Messages",
                    description: "Système de messages bientôt disponible",
                  });
                }}
                title="Messages"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={signOut}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          // Utilisateur non connecté
          <Button 
            variant="default" 
            size="sm"
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Se connecter
          </Button>
        )}
      </div>
    </div>
  );
};
