import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Grid, List } from 'lucide-react';
import { useProducts, useVehicles, useParts, useElectronics } from '@/hooks/useUnifiedProducts';
import ProductCard from '@/components/ProductCard';
import { PartCard } from '@/components/PartCard';
import VehicleCard from '@/components/VehicleCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Boutique() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Récupérer tous les produits
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { vehicles, loading: vehiclesLoading, error: vehiclesError } = useVehicles();
  const { parts, loading: partsLoading, error: partsError } = useParts();
  const { electronics, loading: electronicsLoading, error: electronicsError } = useElectronics();

  // Combiner tous les produits
  const allProducts = [
    ...products.map(p => ({ ...p, type: 'product' as const })),
    ...vehicles.map(v => ({ ...v, type: 'vehicle' as const })),
    ...parts.map(p => ({ ...p, type: 'part' as const })),
    ...electronics.map(e => ({ ...e, type: 'electronics' as const }))
  ];

  // Filtrer les produits
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtenir les catégories uniques
  const categories = ['all', ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)))];

  const isLoading = productsLoading || vehiclesLoading || partsLoading || electronicsLoading;
  const hasError = productsError || vehiclesError || partsError || electronicsError;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Erreur de chargement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Impossible de charger les produits. Veuillez réessayer.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête simple */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Boutique</h1>
        
        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
      </div>

        {/* Filtres simples */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <Button 
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm" 
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'Tous' : category}
            </Button>
          ))}
        </div>

        {/* Contrôles d'affichage */}
        <div className="flex justify-between items-center mb-4">
          <Badge variant="secondary">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
          </Badge>
              
              <div className="flex gap-2">
                        <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
                          size="sm"
              onClick={() => setViewMode('grid')}
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
              variant={viewMode === 'list' ? "default" : "outline"}
                          size="sm"
              onClick={() => setViewMode('list')}
                        >
                          <List className="h-4 w-4" />
                        </Button>
              </div>
            </div>
          </div>

      {/* Grille des produits */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Aucun produit trouvé pour "{searchTerm}"
            </p>
          </CardContent>
        </Card>
      ) : (
          <div className={
            viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
          {filteredProducts.map((product) => {
            switch (product.type) {
              case 'vehicle':
                return <VehicleCard key={product.id} vehicle={product} />;
              case 'part':
                return <PartCard key={product.id} part={product} />;
              default:
                return <ProductCard key={product.id} product={product} />;
            }
          })}
        </div>
      )}
    </div>
  );
}
