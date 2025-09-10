import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Settings, Smartphone, Home } from 'lucide-react';
import { mockProducts, getProductsByCategory } from '@/data/mockData';

const categories = [
  {
    id: 'vehicles',
    title: 'Véhicules',
    description: 'Voitures neuves et d\'occasion de Corée',
    icon: Car,
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'parts',
    title: 'Pièces Détachées',
    description: 'Pièces automobiles originales',
    icon: Settings,
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'electronics',
    title: 'Électronique',
    description: 'Smartphones, ordinateurs, gadgets',
    icon: Smartphone,
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'appliances',
    title: 'Électroménager',
    description: 'Appareils pour la maison',
    icon: Home,
    gradient: 'from-orange-500 to-orange-600'
  }
];

export const CategoriesSection = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
          Nos Catégories
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const products = getProductsByCategory(category.id as any);
            
            return (
              <Card 
                key={category.id} 
                className="card-elevated bg-background border-none cursor-pointer group"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground">
                    {category.title}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    {category.description}
                  </p>
                  <Badge variant="secondary">
                    {products.length} produits
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Products */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8 text-foreground">Produits Populaires</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.slice(0, 4).map((product) => (
              <Card key={product.id} className="card-elevated">
                <CardContent className="p-4">
                  <img 
                    src={product.image_url || '/placeholder.svg'} 
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3" 
                  />
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <span className="text-primary font-bold text-sm">
                      {(product.price_krw * 0.65 * 1.35).toLocaleString()} FCFA
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};