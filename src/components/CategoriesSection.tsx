import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Settings, Smartphone, Home, ArrowRight } from 'lucide-react';
import { mockProducts, getProductsByCategory } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useUnifiedProducts';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { useMonitoring } from '@/lib/monitoring';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useMonitoring();
  const [isLoading, setIsLoading] = useState(false);
  const [realProducts, setRealProducts] = useState<any[]>([]);
  
  // Récupérer les produits réels depuis Supabase
  const { products: productsData, loading: productsLoading, error } = useProducts();

  useEffect(() => {
    if (productsData) {
      setRealProducts(productsData);
    }
  }, [productsData]);

  const handleCategoryClick = async (categoryId: string, categoryTitle: string) => {
    setIsLoading(true);
    trackEvent('category_clicked', { category: categoryId, title: categoryTitle });
    
    try {
      // Simuler un délai pour l'UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      navigate(`/boutique?category=${categoryId}`);
      
      toast({
        title: `Catégorie ${categoryTitle}`,
        description: "Redirection vers la boutique...",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger la catégorie",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (productId: string, productName: string) => {
    trackEvent('product_clicked', { productId, productName });
    navigate(`/boutique?product=${productId}`);
  };

  const getProductsByCategoryId = (categoryId: string) => {
    if (realProducts.length > 0) {
      return realProducts.filter(product => product.category === categoryId);
    }
    // Fallback vers les données mock
    return getProductsByCategory(categoryId as any);
  };

  return (
    <section className="floating-spacing px-4 section-glass">
      <div className="container mx-auto">
        <h3 className="text-2xl lg:text-3xl font-bold text-center mb-8 lg:mb-12 text-foreground">
          Nos Catégories
        </h3>
        
        {productsLoading && (
          <div className="flex justify-center mb-8">
            <LoadingSpinner />
          </div>
        )}
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 lg:mb-16">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const categoryProducts = getProductsByCategoryId(category.id);
            
            return (
              <Card 
                key={category.id} 
                className="floating-card theme-transition cursor-pointer group hover:shadow-lg transition-all duration-300"
                onClick={() => handleCategoryClick(category.id, category.title)}
              >
                <CardContent className="p-4 lg:p-6 text-center">
                  <div className={`w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h4 className="text-lg lg:text-xl font-semibold mb-2 text-foreground">
                    {category.title}
                  </h4>
                  <p className="text-muted-foreground text-xs lg:text-sm mb-3">
                    {category.description}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {categoryProducts.length} produits
                  </Badge>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4 mx-auto text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Products */}
        <div className="text-center">
          <h3 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8 text-foreground">Produits Populaires</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {(realProducts.length > 0 ? realProducts : mockProducts).slice(0, 4).map((product) => (
              <Card 
                key={product.id} 
                className="card-elevated bg-card border border-border cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={() => handleProductClick(product.id, product.name)}
              >
                <CardContent className="p-3 lg:p-4">
                  <img 
                    src={product.image_url || '/placeholder.svg'} 
                    alt={product.name}
                    className="w-full h-24 lg:h-32 object-cover rounded-lg mb-2 lg:mb-3 group-hover:scale-105 transition-transform duration-300" 
                    loading="lazy"
                  />
                  <h4 className="font-semibold text-xs lg:text-sm mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <span className="text-primary font-bold text-xs lg:text-sm">
                      {(product.price_krw * 0.65 * 1.35).toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" className="w-full text-xs">
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button 
            onClick={() => navigate('/boutique')}
            className="bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : 'Voir tous les produits'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};