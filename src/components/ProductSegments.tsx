import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Smartphone, Home, ArrowRight, Zap, Shield, Star } from 'lucide-react';

// Import des images
import hyundaiTucson from '@/assets/hyundai-tucson.jpg';
import samsungGalaxy from '@/assets/samsung-galaxy-s24.jpg';
import lgRefrigerator from '@/assets/lg-refrigerator.jpg';

interface ProductSegmentsProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string;
}

export const ProductSegments: React.FC<ProductSegmentsProps> = ({ 
  onCategorySelect, 
  activeCategory 
}) => {
  const segments = [
    {
      id: 'vehicles',
      title: 'Véhicules',
      description: 'Voitures, motos et véhicules utilitaires coréens',
      image: hyundaiTucson,
      icon: Car,
      color: 'from-blue-600 to-blue-800',
      stats: '500+ modèles',
      features: ['Hyundai', 'Kia', 'Genesis'],
      badge: 'Populaire',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'electronics',
      title: 'Électronique',
      description: 'Smartphones, ordinateurs et gadgets high-tech',
      image: samsungGalaxy,
      icon: Smartphone,
      color: 'from-purple-600 to-purple-800',
      stats: '1000+ produits',
      features: ['Samsung', 'LG', 'SK Hynix'],
      badge: 'Tendance',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'appliances',
      title: 'Électroménager',
      description: 'Appareils ménagers et équipements pour la maison',
      image: lgRefrigerator,
      icon: Home,
      color: 'from-green-600 to-green-800',
      stats: '300+ appareils',
      features: ['LG', 'Samsung', 'Daewoo'],
      badge: 'Qualité',
      badgeColor: 'bg-green-500'
    }
  ];

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nos Segments Produits
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection de produits coréens premium dans trois catégories principales
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {segments.map((segment) => {
            const IconComponent = segment.icon;
            const isActive = activeCategory === segment.id;
            
            return (
              <Card 
                key={segment.id}
                className={`product-segment-card group relative overflow-hidden cursor-pointer ${
                  isActive ? 'ring-2 ring-primary shadow-xl scale-105' : ''
                }`}
                onClick={() => onCategorySelect(segment.id)}
              >
                {/* Image de fond */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={segment.image}
                    alt={segment.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${segment.color} opacity-80 group-hover:opacity-70 transition-opacity duration-300`} />
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`segment-badge ${segment.badgeColor} text-white border-0`}>
                      {segment.badge}
                    </Badge>
                  </div>

                  {/* Icône */}
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Contenu principal */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{segment.title}</h3>
                    <p className="text-white/90 mb-4 line-clamp-2">{segment.description}</p>
                    
                    {/* Statistiques */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{segment.stats}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Garantie</span>
                      </div>
                    </div>

                    {/* Marques */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {segment.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer avec bouton */}
                <CardContent className="p-6">
                  <Button 
                    className={`w-full group-hover:scale-105 transition-transform duration-200 ${
                      isActive ? 'bg-primary' : ''
                    }`}
                    variant={isActive ? "default" : "outline"}
                  >
                    {isActive ? 'Catégorie active' : 'Explorer la catégorie'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Section informative */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Livraison Rapide</h4>
            <p className="text-sm text-muted-foreground">
              Expédition depuis la Corée du Sud en 10-15 jours ouvrés
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Garantie Qualité</h4>
            <p className="text-sm text-muted-foreground">
              Tous nos produits sont neufs avec garantie constructeur
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Prix Transparents</h4>
            <p className="text-sm text-muted-foreground">
              Calcul automatique des frais de transport et douanes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
