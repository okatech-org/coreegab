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
import { useToast } from '@/hooks/use-toast';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from '@/components/ThemeToggle';

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
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <div className="flex-1">
          {/* Header principal avec recherche IA */}
          <header className="bg-card shadow-lg sticky top-0 z-40 border-b border-border">
            <div className="container mx-auto px-4 lg:px-6">
              {/* Première ligne - Logo, Recherche, Actions */}
              <div className="flex items-center justify-between py-3 lg:py-4 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <SidebarTrigger className="lg:hidden" />
                  <h1 className="text-xl lg:text-2xl font-bold gradient-text whitespace-nowrap">
                    COREGAB Shop
                  </h1>
                </div>
                
                {/* Barre de recherche - masquée sur mobile, visible sur desktop */}
                <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                  <AISearchBar 
                    onSearch={handleSearch}
                    placeholder="🤖 Recherche IA : 'téléphone Samsung récent' ou 'voiture familiale économique'"
                  />
                </div>
                
                {/* Actions - toujours visibles */}
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Button variant="outline" size="sm" className="relative border-border hover:bg-muted">
                    <ShoppingCart className="w-4 h-4" />
                    {cartItems.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5 bg-primary text-primary-foreground">
                        {cartItems.length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Deuxième ligne mobile - Recherche visible uniquement sur mobile */}
              <div className="md:hidden pb-3">
                <AISearchBar 
                  onSearch={handleSearch}
                  placeholder="🔍 Rechercher des produits..."
                />
              </div>
            </div>
          </header>

          <main>
            {/* Navigation par segments - Responsive */}
            <div className="bg-card border-b border-border">
              <div className="container mx-auto px-4 lg:px-6">
                {/* Desktop: Navigation horizontale */}
                <div className="hidden lg:flex items-center gap-4 py-4 overflow-x-auto">
                  <div className="flex items-center gap-4 min-w-max">
                    {/* Segment "Tous" */}
                    <button
                      onClick={() => setActiveSegment('all')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                        activeSegment === 'all' 
                          ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                          : 'bg-muted hover:bg-muted/80 text-foreground hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🛍️</span>
                        <div className="text-left">
                          <div className="font-semibold">Tous les produits</div>
                          <div className="text-xs opacity-75">{mockProducts.length} produits</div>
                        </div>
                      </div>
                  </button>
                    {/* Segments principaux */}
                    {segmentStats.map((segment) => {
                      const IconComponent = segmentIcons[segment.id as keyof typeof segmentIcons];
                      return (
                        <button
                          key={segment.id}
                          onClick={() => setActiveSegment(segment.id as keyof typeof boutiqueSegments)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                            activeSegment === segment.id 
                              ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                              : 'bg-muted hover:bg-muted/80 text-foreground hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{segment.icon}</span>
                            <div className="text-left">
                              <div className="font-semibold">{segment.name}</div>
                              <div className="text-xs opacity-75">
                                {segment.inStockProducts}/{segment.totalProducts} en stock
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Mobile: Navigation en grille */}
                <div className="lg:hidden py-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Segment "Tous" - Mobile */}
                    <button
                      onClick={() => setActiveSegment('all')}
                      className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl font-medium transition-all ${
                        activeSegment === 'all' 
                          ? 'bg-primary text-primary-foreground shadow-lg' 
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      <span className="text-2xl">🛍️</span>
                      <div className="text-center">
                        <div className="text-sm font-semibold">Tous</div>
                        <div className="text-xs opacity-75">{mockProducts.length}</div>
                      </div>
                    </button>

                    {/* Segments principaux - Mobile */}
                    {segmentStats.map((segment) => (
                      <button
                        key={segment.id}
                        onClick={() => setActiveSegment(segment.id as keyof typeof boutiqueSegments)}
                        className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl font-medium transition-all ${
                          activeSegment === segment.id 
                            ? 'bg-primary text-primary-foreground shadow-lg' 
                            : 'bg-muted hover:bg-muted/80 text-foreground'
                        }`}
                      >
                        <span className="text-2xl">{segment.icon}</span>
                        <div className="text-center">
                          <div className="text-sm font-semibold">{segment.name}</div>
                          <div className="text-xs opacity-75">
                            {segment.inStockProducts}/{segment.totalProducts}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Sidebar Filtres - Masquée sur mobile */}
                <aside className="w-72 hidden xl:block">
                  <FilterPanel onFiltersChange={handleFiltersChange} />
                </aside>
                
                {/* Zone principale */}
                <div className="flex-1">
                  {/* En-tête de section avec bouton filtres mobile */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div className="flex-1">
                      <h2 className="text-xl lg:text-2xl font-semibold mb-1 text-foreground">
                        {activeSegment === 'all' 
                          ? 'Tous les produits' 
                          : boutiqueSegments[activeSegment].name
                        }
                      </h2>
                      <p className="text-sm lg:text-base text-muted-foreground">
                        <span className="font-semibold">{getFilteredProducts().filter(p => p.in_stock).length}</span> produits disponibles immédiatement
                      </p>
                    </div>
                    
                    {/* Bouton Filtres - Visible uniquement sur mobile/tablette */}
                    <div className="xl:hidden">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtres
                      </Button>
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
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}