import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ShoppingCart, Sparkles, Car, Smartphone, Home, Loader2, AlertCircle, Grid, List } from 'lucide-react';
import { useProducts, useCart } from '@/hooks/useProducts';
import { useParts } from '@/hooks/useParts';
import { mockProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import { PartCard } from '@/components/PartCard';
import { BoutiqueSections } from '@/components/BoutiqueSections';
import { VehicleSelector } from '@/components/VehicleSelector';
import { AdvancedFilters, type FilterState } from '@/components/AdvancedFilters';
import { DesktopHeader } from '@/components/DesktopHeader';
import { BoutiqueLoadingState } from '@/components/BoutiqueLoadingState';
import { useToast } from '@/hooks/use-toast';
import { NewVerticalMenu } from '@/components/NewVerticalMenu';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import type { Product, Part } from '@/types/database';

// Types minimaux utilisés par l'UI pour afficher les éléments
interface BasicItem {
  id: string;
  name: string;
  price_krw: number;
  image_url?: string;
  description?: string;
  category?: string;
  part_number?: string;
  brand?: string;
}

// Icônes pour les catégories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
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
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filtres avancés
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    brand: 'all',
    priceRange: [0, 1000000],
    inStock: false,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  
  // Utiliser les hooks pour les données réelles
  const { 
    data: productsResult, 
    isLoading: productsLoading, 
    error: productsError 
  } = useProducts({
    category: activeCategory !== 'all' ? activeCategory : undefined,
    search: searchQuery || undefined,
    limit: 12,
    offset: currentPage * 12,
  }, { enabled: !selectedVehicleId });

  const {
    data: partsResult,
    isLoading: partsLoading,
    error: partsError,
  } = useParts({
    vehicleId: selectedVehicleId || undefined,
    search: searchQuery || undefined,
    limit: 12,
    offset: currentPage * 12,
  });
  
  const { cartItems, addToCart, removeFromCart, getCartCount } = useCart();
  const createOrder = useCreateOrder();

  // Déterminer quelles données afficher
  const isLoading = selectedVehicleId ? partsLoading : (productsLoading && !selectedVehicleId);
  const error = selectedVehicleId ? partsError : productsError;
  const displayData = selectedVehicleId ? (partsResult as any)?.data : (productsResult as any)?.data;
  
  const rawProducts = useMemo(() => {
    // Si on a des données de la base, les utiliser
    if (displayData && displayData.length > 0) {
      return displayData as BasicItem[];
    }
    
    // Sinon, utiliser les données mock pour les produits génériques
    if (!selectedVehicleId) {
      return mockProducts as BasicItem[];
    }
    
    // Pour les pièces, retourner un tableau vide si pas de données
    return [];
  }, [displayData, selectedVehicleId]);

  // Filtrage et tri des produits
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...rawProducts];

    // Filtre par recherche
    if (advancedFilters.search) {
      const searchLower = advancedFilters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.part_number?.toLowerCase().includes(searchLower) ||
        item.brand?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    }

            // Filtre par catégorie (gestion des sections)
            if (advancedFilters.category !== 'all') {
              if (advancedFilters.category === 'vehicles') {
                filtered = filtered.filter(item => item.category === 'vehicles');
              } else if (advancedFilters.category === 'electronics') {
                filtered = filtered.filter(item => item.category === 'electronics' || item.category === 'smartphones');
              } else if (advancedFilters.category === 'appliances') {
                filtered = filtered.filter(item => item.category === 'appliances');
              } else if (advancedFilters.category === 'parts') {
                filtered = filtered.filter(item => item.category === 'parts');
              } else {
                filtered = filtered.filter(item => item.category === advancedFilters.category);
              }
            }

    // Filtre par marque
    if (advancedFilters.brand !== 'all') {
      filtered = filtered.filter(item => item.brand === advancedFilters.brand);
    }

    // Filtre par prix
    filtered = filtered.filter(item => 
      item.price_krw >= advancedFilters.priceRange[0] && 
      item.price_krw <= advancedFilters.priceRange[1]
    );

    // Filtre par stock (pour les pièces)
    if (advancedFilters.inStock && selectedVehicleId) {
      filtered = filtered.filter(item => 
        (item as Part).stock_quantity && (item as Part).stock_quantity! > 0
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (advancedFilters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price_krw;
          bValue = b.price_krw;
          break;
        case 'brand':
          aValue = a.brand || '';
          bValue = b.brand || '';
          break;
        case 'stock':
          aValue = (a as Part).stock_quantity || 0;
          bValue = (b as Part).stock_quantity || 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (advancedFilters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [rawProducts, advancedFilters, selectedVehicleId]);

  const products = filteredAndSortedProducts;

  // Extraire les catégories et marques uniques pour les filtres
  const availableCategories = useMemo(() => {
    const categories = new Set(rawProducts.map(item => item.category).filter(Boolean));
    return Array.from(categories).sort();
  }, [rawProducts]);

  const availableBrands = useMemo(() => {
    const brands = new Set(rawProducts.map(item => item.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [rawProducts]);

  const maxPrice = useMemo(() => {
    return Math.max(...rawProducts.map(item => item.price_krw), 1000000);
  }, [rawProducts]);

  // Gérer la sélection d'un véhicule
  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setActiveCategory('parts'); // Passer à la catégorie 'pièces'
    setCurrentPage(0);
    // Réinitialiser les filtres avancés
    setAdvancedFilters({
      search: '',
      category: 'all',
      brand: 'all',
      priceRange: [0, maxPrice],
      inStock: false,
      sortBy: 'name',
      sortOrder: 'asc',
    });
    toast({
      title: "Véhicule sélectionné",
      description: "Affichage des pièces compatibles.",
    });
  };

  // Gérer les filtres avancés
  const handleAdvancedFiltersChange = (newFilters: FilterState) => {
    setAdvancedFilters(newFilters);
    setCurrentPage(0);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setAdvancedFilters({
      search: '',
      category: 'all',
      brand: 'all',
      priceRange: [0, maxPrice],
      inStock: false,
      sortBy: 'name',
      sortOrder: 'asc',
    });
    setCurrentPage(0);
  };

  // Gérer l'ajout au panier
  const handleAddToCart = (item: BasicItem | Part) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier",
        variant: "destructive",
      });
      return;
    }
    
    // Cast vers Product pour le panier local
    const product = item as Product;
    addToCart(product);
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté au panier`,
    });
  };

  // Gérer la commande directe
  const handleOrderNow = async (item: BasicItem | Part) => {
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
    const customsCost = item.price_krw! * customsRate;
    const totalKrw = item.price_krw! + shippingCost + customsCost;
    const finalPriceXaf = Math.round(totalKrw * 0.65); // Conversion KRW vers XAF

    createOrder.mutate({
      product_id: item.id,
      quantity: 1,
      unit_price_krw: item.price_krw!,
      total_price_krw: item.price_krw!,
      shipping_cost_krw: shippingCost,
      customs_cost_krw: customsCost,
      final_price_xaf: finalPriceXaf,
      status: 'pending',
    });
  };

  // Gérer la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0); // Reset à la première page
  };

  // Composant de chargement
  if (isLoading) {
    return <BoutiqueLoadingState />;
  }

  return (
    <div className="min-h-screen w-full">
      <div className="fixed top-4 left-4 bottom-4 z-50 hidden lg:block">
        <NewVerticalMenu />
      </div>
      <div className="flex-1 lg:pl-[340px]">
        {/* Header desktop avec navigation complète */}
        <DesktopHeader 
          title="Boutique" 
          showNavigation={false}
          rightContent={
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {getCartCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  {getCartCount()}
                </Badge>
              )}
            </Button>
          }
        >
          <Badge variant="secondary" className="ml-2">
            {products.length} produits
          </Badge>
        </DesktopHeader>

        <div className="p-4 lg:px-6">
          {/* Banner d'erreur non bloquante */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-destructive">Erreur lors du chargement des produits. Vous pouvez réessayer ou sélectionner un véhicule pour voir les pièces compatibles.</span>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="ml-auto">Réessayer</Button>
            </div>
          )}
        </div>

                {/* Sections organisées de la boutique */}
                <BoutiqueSections 
                  onSectionSelect={setActiveCategory}
                  activeCategory={activeCategory}
                />

        <div className="p-6 space-y-6">
          {/* Sélecteur de véhicule */}
          <VehicleSelector onVehicleSelect={handleVehicleSelect} />

          {selectedVehicleId && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setSelectedVehicleId(null)}
              >
                Voir tous les produits
              </Button>
            </div>
          )}

          {/* Barre de recherche et contrôles */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche et filtres */}
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
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
                            <SelectItem value="vehicles">🚗 Véhicules Coréens</SelectItem>
                            <SelectItem value="electronics">📱 Électronique Coréenne</SelectItem>
                            <SelectItem value="appliances">🏠 Électroménager Coréen</SelectItem>
                            <SelectItem value="parts">🔧 Pièces Automobiles</SelectItem>
                          </SelectContent>
                        </Select>
                
                <AdvancedFilters
                  filters={advancedFilters}
                  onFiltersChange={handleAdvancedFiltersChange}
                  onReset={handleResetFilters}
                  categories={availableCategories}
                  brands={availableBrands}
                  maxPrice={maxPrice}
                  isOpen={showFilters}
                  onToggle={() => setShowFilters(!showFilters)}
                />
              </div>
            </div>

            {/* Contrôles de vue et tri */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Badge variant="secondary" className="text-sm">
                {products.length} {selectedVehicleId ? 'pièces' : 'produits'}
              </Badge>
            </div>
          </div>

          {/* Grille de produits */}
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {products.map((product) => {
              // Utiliser PartCard pour les pièces automobiles, ProductCard pour les autres
              if (selectedVehicleId && product.part_number) {
                return (
                  <PartCard
                    key={product.id}
                    part={product as Part}
                    onAddToCart={handleAddToCart}
                    onOrderNow={handleOrderNow}
                    showActions={true}
                  />
                );
              } else {
                return (
                  <ProductCard
                    key={product.id}
                    product={product as Product}
                    onOrder={handleOrderNow}
                  />
                );
              }
            })}
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
