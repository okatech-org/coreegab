import React from 'react';
import { ShoppingCart, CreditCard, Truck, Package } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Choisissez',
    description: 'Sélectionnez vos produits dans notre catalogue',
    icon: ShoppingCart,
    color: 'bg-primary'
  },
  {
    id: 2,
    title: 'Commandez',
    description: 'Passez votre commande et effectuez le paiement',
    icon: CreditCard,
    color: 'bg-secondary'
  },
  {
    id: 3,
    title: 'Nous importons',
    description: 'Nous gérons l\'achat, transport et douanes',
    icon: Truck,
    color: 'bg-accent'
  },
  {
    id: 4,
    title: 'Recevez',
    description: 'Récupérez votre commande à Libreville',
    icon: Package,
    color: 'bg-primary'
  }
];

export const ProcessTimeline = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
          Comment ça marche ?
        </h3>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.id} className="relative text-center">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent transform translate-x-0 z-0" />
                )}
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${step.color} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-background p-4 rounded-xl card-elevated">
                    <h4 className="text-lg font-semibold mb-2 text-foreground">
                      {step.id}. {step.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
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