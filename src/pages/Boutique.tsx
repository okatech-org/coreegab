import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ShoppingCart, Sparkles, Car, Smartphone, Home, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useProducts, useCategories } from '@/hooks/useUnifiedProducts';
import ProductCard from '@/components/ProductCard';
import { ProductSegments } from '@/components/ProductSegments';
import { DesktopFloatingHeader } from '@/components/DesktopFloatingHeader';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';

// Icônes pour les catégories
const categoryIcons: Record<string, any> = {
  vehicles: Car,
  electronics: Smartphone,
  appliances: Home,
  parts: Car,
};

export default function Boutique() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  
  // Utiliser les hooks pour les données réelles
  const { 
    products: productsResult, 
    loading: productsLoading, 
    error: productsError 
  } = useProducts({
    category: activeCategory !== 'all' ? activeCategory : undefined,
    search_query: searchQuery || undefined,
    limit: 12,
    offset: currentPage * 12,
  });
  
  const { categories: categoriesResult, loading: categoriesLoading } = useCategories();
  const { cartItems, addToCart, removeFromCart, getCartCount } = useCart();
  const createOrder = useCreateOrder();

  // Extraire les données des résultats
  const products = productsResult || [];
  const categories = categoriesResult || [];

  // Gérer l'ajout au panier
  const handleAddToCart = (product: any) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product);
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté au panier`,
    });
  };

  // Gérer la commande directe
  const handleOrderNow = async (product: any) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour passer une commande",
        variant: "destructive",
      });
      return;
    }

    // Calculer le prix final (simplifié pour la démo)
    const shippingCost = 50000; // KRW
    const customsRate = 0.2; // 20%
    const customsCost = product.price_krw * customsRate;
    const totalKrw = product.price_krw + shippingCost + customsCost;
    const finalPriceXaf = Math.round(totalKrw * 0.65); // Conversion KRW vers XAF

    createOrder.mutate({
      products: { items: [{ id: product.id, quantity: 1, name: product.name }] },
      supplier_price: product.price_krw,
      transport_cost: shippingCost,
      customs_cost: customsCost,
      margin: finalPriceXaf - (product.price_krw + shippingCost + customsCost),
      total_price: finalPriceXaf,
      status: 'pending' as any,
    });
  };

  // Gérer la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0); // Reset à la première page
  };

  // Composant de chargement
  if (productsLoading) {
    return (
      <div className="min-h-screen w-full">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen lg:pl-[340px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  // Composant d'erreur
  if (productsError) {
    return (
      <div className="min-h-screen w-full">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen lg:pl-[340px]">
          <div className="text-center space-y-4">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <p className="text-muted-foreground">Erreur lors du chargement des produits</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header avec panier */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Boutique</h1>
            <Badge variant="secondary" className="mt-2">
              {products.length} produits
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4" />
            {getCartCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                {getCartCount()}
              </Badge>
            )}
          </Button>
        </div>

        {/* Segments de produits */}
        <ProductSegments 
          onCategorySelect={setActiveCategory}
          activeCategory={activeCategory}
        />

        <div className="space-y-6">
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">
                Rechercher
              </Button>
            </form>
            
            <div className="flex gap-2">
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.category} value={cat.category}>
                        {cat.category} ({cat.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Grille de produits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                    {product.thumbnail_url ? (
                      <img
                        src={product.thumbnail_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                        <Smartphone className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-2 text-sm">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      <span className="font-bold text-primary">
                        {formatPrice(product.price_krw, 'KRW')}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToCart(product)}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Panier
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleOrderNow(product)}
                        className="flex-1"
                        disabled={createOrder.isPending}
                      >
                        {createOrder.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Commander"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message si aucun produit */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche ou de filtrage
              </p>
            </div>
          )}

          {/* Pagination (basique) */}
          {products.length === 12 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Suivant
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}