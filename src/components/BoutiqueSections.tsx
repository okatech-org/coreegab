import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Smartphone, Home, Wrench, ArrowRight, Star } from 'lucide-react';
import { boutiqueSegments } from '@/data/mockData';

interface BoutiqueSectionsProps {
  onSectionSelect: (sectionId: string) => void;
  activeSection?: string;
}

export const BoutiqueSections: React.FC<BoutiqueSectionsProps> = ({ 
  onSectionSelect, 
  activeSection = 'all' 
}) => {
  const sectionIcons = {
    vehicles: Car,
    electronics: Smartphone,
    appliances: Home,
    parts: Wrench,
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Boutique COREEGAB</h2>
        <p className="text-muted-foreground">
          Import Corée-Gabon - Produits coréens de qualité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Section Toutes catégories */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeSection === 'all' 
              ? 'ring-2 ring-primary shadow-lg' 
              : 'hover:ring-1 hover:ring-primary/50'
          }`}
          onClick={() => onSectionSelect('all')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Toutes catégories</CardTitle>
              </div>
              <Badge variant="secondary">Tout</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Découvrez tous nos produits coréens
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-between"
              onClick={(e) => {
                e.stopPropagation();
                onSectionSelect('all');
              }}
            >
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Sections spécialisées */}
        {Object.entries(boutiqueSegments).map(([key, segment]) => {
          const IconComponent = sectionIcons[key as keyof typeof sectionIcons];
          
          return (
            <Card 
              key={key}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                activeSection === key 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:ring-1 hover:ring-primary/50'
              }`}
              onClick={() => onSectionSelect(key)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{segment.name}</CardTitle>
                  </div>
                  <Badge variant="outline">{segment.categories.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {segment.description}
                </p>
                
                {/* Sous-catégories */}
                {segment.subcategories && segment.subcategories.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {segment.subcategories.slice(0, 3).map((sub, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {sub}
                        </Badge>
                      ))}
                      {segment.subcategories.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{segment.subcategories.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSectionSelect(key);
                  }}
                >
                  Explorer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Section spéciale pour les pièces automobiles */}
      {activeSection === 'parts' && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Pièces Automobiles - Sélection par Véhicule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Pour trouver les pièces compatibles avec votre véhicule, utilisez le sélecteur de véhicule ci-dessous.
              Nous avons plus de 55 pièces avec références réelles pour Hyundai et Kia.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {boutiqueSegments.parts.subcategories?.map((sub, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {sub}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
