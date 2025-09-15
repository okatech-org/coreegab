import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, Crown, Briefcase } from 'lucide-react';
import { demoAccounts } from '@/data/mockData';

interface DemoLoginProps {
  onDemoLogin?: (role: 'client' | 'commercial' | 'admin') => void;
}

const roleConfig = {
  client: {
    icon: User,
    title: 'Client',
    description: 'Parcourir le catalogue et passer commande',
    color: 'bg-blue-500',
    features: ['Catalogue produits', 'Panier', 'Suivi commandes', 'Calculateur de prix']
  },
  commercial: {
    icon: Briefcase,
    title: 'Commercial',
    description: 'Gérer les clients et suivre les ventes',
    color: 'bg-green-500',
    features: ['Gestion clients', 'Création commandes', 'Suivi ventes', 'Calculateur commissions']
  },
  admin: {
    icon: Crown,
    title: 'Administrateur',
    description: 'Administration complète de la plateforme',
    color: 'bg-purple-500',
    features: ['Gestion utilisateurs', 'Gestion produits', 'Analytics', 'Paramètres système']
  }
};

export default function DemoLogin({ onDemoLogin }: DemoLoginProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Testez la Plateforme COREEGAB
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez toutes les fonctionnalités en mode démo. Choisissez votre profil et explorez l'interface adaptée à vos besoins.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Object.entries(roleConfig).map(([role, config]) => {
            const IconComponent = config.icon;
            const account = demoAccounts[role as keyof typeof demoAccounts];
            
            return (
              <Card 
                key={role} 
                className={`card-elevated cursor-pointer transition-all duration-300 ${
                  selectedRole === role ? 'ring-2 ring-primary transform scale-105' : ''
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${config.color} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{config.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {config.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{account.email}</p>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Nom:</span>
                      <p className="font-medium">{account.name}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">Fonctionnalités:</h4>
                    <div className="space-y-1">
                      {config.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = '/auth';
                    }}
                    variant={selectedRole === role ? "default" : "outline"}
                  >
                    Se connecter comme {config.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Accès Démo</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Tous les comptes démo sont disponibles sur la page de connexion. 
                Explorez librement toutes les fonctionnalités sans inscription.
              </p>
              <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                <span>✓ Données réalistes</span>
                <span>✓ Fonctionnalités complètes</span>
                <span>✓ Interface responsive</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}