import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ShoppingCart, Sparkles } from 'lucide-react';
import { mockProducts, calculateFinalPrice } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import FilterPanel from '@/components/FilterPanel';
import ProductGrid from '@/components/ProductGrid';
import AISearchBar from '@/components/AISearchBar';
import { useToast } from '@/components/ui/use-toast';

const categories = [
  { id: 'all', label: 'Tous', count: 248 },
  { id: 'smartphones', label: 'Smartphones', count: 52 },
  { id: 'electronics', label: 'Électronique', count: 74 },
  { id: 'appliances', label: 'Électroménager', count: 36 },
  { id: 'vehicles', label: 'Véhicules', count: 28 },
  { id: 'parts', label: 'Pièces détachées', count: 58 }
];

const aiSuggestions = [
  'Téléphones Samsung récents',
  'Réfrigérateurs économiques', 
  'Voitures familiales',
  'Ordinateurs portables gaming',
  'Télévisions 4K'
];

export default function Boutique() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [cart, setCart] = useState([]);
  const [isAISearching, setIsAISearching] = useState(false);
  const { toast } = useToast();

  const handleAISearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsAISearching(true);
    // Simulate AI search processing
    setTimeout(() => {
      setIsAISearching(false);
      toast({
        title: "Recherche IA terminée",
        description: `${Math.floor(Math.random() * 50) + 10} produits trouvés pour "${query}"`,
      });
    }, 1500);
  };

  const addToCart = (product: any) => {
    setCart(prev => [...prev, product]);
    toast({
      title: "Produit ajouté",
      description: `${product.name} ajouté au panier`,
    });
  };

  const calculateFinalPrice = (product: any) => {
    // Convert KRW to FCFA (example rate: 1 KRW = 0.65 FCFA)
    const basePrice = product.price_krw * 0.65;
    // Add margin and other costs
    return Math.round(basePrice * 1.35);
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header avec recherche IA */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              COREGAB Shop
            </h1>
            
            {/* Barre de recherche IA */}
            <div className="relative flex-1 max-w-2xl">
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🤖 Recherche IA : 'téléphone Samsung récent' ou 'voiture familiale économique'"
                  className="w-full pl-12 pr-12 py-3 rounded-full border-2"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Button
                  onClick={() => handleAISearch(searchQuery)}
                  disabled={isAISearching}
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                >
                  {isAISearching ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Panier */}
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filtres */}
          <aside className="w-64 hidden lg:block">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Catégories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center hover:bg-muted ${
                        selectedCategory === category.id ? 'bg-primary text-primary-foreground' : ''
                      }`}
                    >
                      <span>{category.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
          
          {/* Zone principale */}
          <main className="flex-1">
            {/* Suggestions IA */}
            {searchQuery === '' && (
              <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Suggestions IA
                </p>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map((suggestion, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setSearchQuery(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Stats et tri */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredProducts.length} produits</span> disponibles immédiatement
              </p>
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Plus populaires</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="newest">Plus récents</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Grille de produits */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOrder={addToCart}
                  calculateFinalPrice={calculateFinalPrice}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez avec d'autres mots-clés ou explorez nos catégories
                </p>
                <Button onClick={() => setSearchQuery('')}>
                  Voir tous les produits
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}