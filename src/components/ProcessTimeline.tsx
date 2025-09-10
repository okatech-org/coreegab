import React from 'react';
import { ShoppingCart, CreditCard, Truck, Package } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Choisissez',
    description: 'Sélectionnez vos produits dans notre catalogue',
    icon: ShoppingCart,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Commandez',
    description: 'Passez votre commande et effectuez le paiement',
    icon: CreditCard,
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Nous importons',
    description: 'Nous gérons l\'achat, transport et douanes',
    icon: Truck,
    color: 'bg-orange-500'
  },
  {
    id: 4,
    title: 'Recevez',
    description: 'Récupérez votre commande à Libreville',
    icon: Package,
    color: 'bg-purple-500'
  }
];

export const ProcessTimeline = () => {
  return (
    <section className="floating-spacing px-4 section-glass">
      <div className="container mx-auto">
        <h3 className="text-2xl lg:text-3xl font-bold text-center mb-8 lg:mb-12 text-foreground">
          Comment ça marche ?
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.id} className="relative text-center">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-400/30 to-transparent transform translate-x-0 z-0" />
                )}
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 rounded-full ${step.color} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="floating-card theme-transition p-3 lg:p-4">
                    <h4 className="text-base lg:text-lg font-semibold mb-2 text-foreground">
                      {step.id}. {step.title}
                    </h4>
                    <p className="text-muted-foreground text-xs lg:text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};