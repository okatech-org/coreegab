import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SEO } from '@/components/SEO';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { cn } from '@/lib/utils';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const mobile = useMobileOptimizations();
  
  // Récupérer les articles du panier depuis l'état de navigation
  const cartItems = location.state?.cartItems || [];

  // Rediriger si pas d'articles ou pas connecté
  if (!user) {
    navigate('/auth', { state: { from: location } });
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/boutique');
    return null;
  }

  const handleComplete = (orderId: string) => {
    navigate('/client-dashboard', { 
      state: { 
        showOrder: orderId,
        message: 'Commande créée avec succès !' 
      }
    });
  };

  const handleCancel = () => {
    navigate('/boutique');
  };

  return (
    <>
      <SEO
        title="Finaliser ma commande - COREGAB"
        description="Finalisez votre commande d'import depuis la Corée du Sud avec COREGAB"
        noIndex={true}
      />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {!mobile.isMobile && <AppSidebar />}
          
          <div className="flex-1">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="lg:hidden" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la boutique
                  </Button>
                </div>
                <h1 className="text-lg font-semibold">Finaliser ma commande</h1>
              </div>
            </div>

            {/* Contenu principal */}
            <div className={cn(
              'p-4 lg:p-6',
              mobile.isMobile && 'pb-20' // Espace pour la navigation mobile
            )}>
              <CheckoutFlow
                cartItems={cartItems}
                onComplete={handleComplete}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
        
        {mobile.isMobile && <MobileNavigation />}
      </SidebarProvider>
    </>
  );
}
