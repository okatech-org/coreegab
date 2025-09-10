import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ShoppingCart, Sparkles, Car, Smartphone, Home } from 'lucide-react';
import { mockProducts, calculateFinalPrice, boutiqueSegments, getProductsBySegment, getSegmentStats } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import FilterPanel from '@/components/FilterPanel';
import ProductGrid from '@/components/ProductGrid';
import AISearchBar from '@/components/AISearchBar';
import { useToast } from '@/components/ui/use-toast';

// Icônes pour les segments
const segmentIcons = {
  auto: Car,
  electronics: Smartphone,
  appliances: Home
};

export default function Boutique() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegment, setActiveSegment] = useState<keyof typeof boutiqueSegments | 'all'>('all');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { toast } = useToast();

  // Obtenir les statistiques des segments
  const segmentStats = getSegmentStats();

  // Filtrer les produits selon le segment actif
  const getFilteredProducts = () => {
    if (activeSegment === 'all') {
      return mockProducts;
    }
    return getProductsBySegment(activeSegment);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement AI search logic
    console.log('Search query:', query);
  };

  const handleFiltersChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // TODO: Apply filters to product list
  };

  const handleAddToCart = (product: any) => {
    setCartItems([...cartItems, product]);
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté au panier`,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header avec recherche IA */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold gradient-text">COREGAB Shop</h1>
            
            {/* Search Bar */}
            <AISearchBar 
              onSearch={handleSearch}
              placeholder="🤖 Recherche IA : 'téléphone Samsung récent' ou 'voiture familiale économique'"
            />
            
            {/* Cart Icon */}
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart className="w-4 h-4" />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5">
                  {cartItems.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation par segments */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            {/* Segment "Tous" */}
            <button
              onClick={() => setActiveSegment('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeSegment === 'all' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <span>🛍️</span>
              <div className="text-left">
                <div>Tous les produits</div>
                <div className="text-xs opacity-75">{mockProducts.length} produits</div>
              </div>
            </button>

            {/* Segments principaux */}
            {segmentStats.map((segment) => {
              const IconComponent = segmentIcons[segment.id as keyof typeof segmentIcons];
              return (
                <button
                  key={segment.id}
                  onClick={() => setActiveSegment(segment.id as keyof typeof boutiqueSegments)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeSegment === segment.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <span className="text-xl">{segment.icon}</span>
                  <div className="text-left">
                    <div>{segment.name}</div>
                    <div className="text-xs opacity-75">
                      {segment.inStockProducts}/{segment.totalProducts} en stock
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filtres */}
          <aside className="w-64 hidden lg:block">
            <FilterPanel onFiltersChange={handleFiltersChange} />
          </aside>
          
          {/* Zone principale */}
          <main className="flex-1">
            {/* Stats et tri */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  {activeSegment === 'all' 
                    ? 'Tous les produits' 
                    : boutiqueSegments[activeSegment].name
                  }
                </h2>
                <p className="text-muted-foreground">
                  <span className="font-semibold">{getFilteredProducts().filter(p => p.in_stock).length}</span> produits disponibles immédiatement
                </p>
              </div>
            </div>

            {/* Grille de produits */}
            <ProductGrid 
              searchQuery={searchQuery}
              filters={{
                segment: activeSegment,
                products: getFilteredProducts()
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
}