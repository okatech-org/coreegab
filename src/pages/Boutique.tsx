import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ShoppingCart, Sparkles, Car, Smartphone, Home, Loader2, AlertCircle, Grid, List } from 'lucide-react';
import { useProducts, useCart } from '@/hooks/useProducts';
import { useParts } from '@/hooks/useParts';
import { useVehicles } from '@/hooks/useVehicles';
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
import { vehicleCompatibilityService } from '@/services/vehicleCompatibilityService';
import VehicleCard from '@/components/VehicleCard';
import { koreanVehicles } from '@/services/koreanVehiclesData';
import type { Product, Part } from '@/types/database';
import type { KoreanVehicle } from '@/services/koreanVehiclesData';

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
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Filtres unifiés - source unique de vérité
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    brand: 'all',
    priceRange: [0, 1000000],
    inStock: false,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  
  // Récupérer les véhicules depuis Supabase (avec fallback vers mock)
  const { data: vehiclesData, isLoading: vehiclesLoading, error: vehiclesError } = useVehicles({
    category: filters.category === 'vehicles' ? 'vehicles' : undefined,
    limit: 50
  }, { enabled: filters.category === 'vehicles' });

  // Synchroniser activeCategory avec filters.category
  React.useEffect(() => {
    if (filters.category !== activeCategory) {
      setActiveCategory(filters.category);
    }
  }, [filters.category, activeCategory]);

  // Forcer le rechargement des données quand les filtres changent
  React.useEffect(() => {
    // Réinitialiser la page quand les filtres changent
    setCurrentPage(0);
  }, [filters.category, filters.search, filters.brand, filters.priceRange, filters.inStock, filters.sortBy, filters.sortOrder]);

  // Fonction de retry automatique en cas d'erreur
  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      // Simuler un délai de retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Réinitialiser les erreurs
      setSearchError(null);
      
      toast({
        title: "Tentative de reconnexion",
        description: `Tentative ${retryCount + 1}/3`,
      });
      
      // Forcer un rechargement des données
      window.location.reload();
      
    } catch (error) {
      if (retryCount < 2) {
        toast({
          title: "Échec de la reconnexion",
          description: "Nouvelle tentative en cours...",
          variant: "destructive",
        });
        setTimeout(() => handleRetry(), 2000);
      } else {
        toast({
          title: "Impossible de se reconnecter",
          description: "Veuillez vérifier votre connexion internet",
          variant: "destructive",
        });
      }
    } finally {
      setIsRetrying(false);
    }
  };
  
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  
  // Utiliser les hooks pour les données réelles avec filtres
  const { 
    data: productsResult, 
    isLoading: productsLoading, 
    error: productsError 
  } = useProducts({
    category: filters.category !== 'all' ? filters.category : undefined,
    search: filters.search || undefined,
    limit: 50, // Récupérer plus de données pour le filtrage local
    offset: 0,
  }, { 
    enabled: !selectedVehicleId
  });

  const {
    data: partsResult,
    isLoading: partsLoading,
    error: partsError,
  } = useParts({
    vehicleId: selectedVehicleId || undefined,
    search: filters.search || undefined,
    limit: 50, // Récupérer plus de données pour le filtrage local
    offset: 0,
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
    
    // Si la catégorie est "vehicles", utiliser les véhicules coréens (Supabase + mock)
    if (filters.category === 'vehicles') {
      const supabaseVehicles = (vehiclesData as any)?.data || [];
      const mockVehicles = koreanVehicles || [];
      
      // Si on a des véhicules de Supabase, les utiliser
      if (supabaseVehicles.length > 0) {
        const allVehicles = [
          ...supabaseVehicles.map((v: any) => ({
            id: v.id,
            name: v.name,
            price_krw: v.final_price_fcfa || v.supplier_price_fcfa || 0,
            image_url: v.images?.[0] || '/placeholder-car.svg',
            description: v.description || '',
            category: v.category || 'vehicles',
            brand: v.brand || '',
            model: v.model || '',
            year: v.year || 2024,
            specifications: v.specifications || {},
            features: v.features || [],
            in_stock: v.status === 'active',
            stock_quantity: 1
          })),
          ...mockVehicles
        ];
        return allVehicles as BasicItem[];
      }
      
      // Sinon, utiliser les véhicules mock
      return mockVehicles as BasicItem[];
    }
    
    // Sinon, utiliser les données mock pour les produits génériques
    if (!selectedVehicleId) {
      return mockProducts as BasicItem[];
    }
    
    // Pour les pièces, retourner un tableau vide si pas de données
    return [];
  }, [displayData, selectedVehicleId, filters.category]);

  // Filtrage et tri des produits - appliqué à toutes les données
  const filteredAndSortedProducts = useMemo(() => {
    // Utiliser les données disponibles (base de données ou mock)
    let filtered = [...rawProducts];

    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.part_number?.toLowerCase().includes(searchLower) ||
        item.brand?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par catégorie (gestion des sections)
    if (filters.category !== 'all') {
      if (filters.category === 'vehicles') {
        filtered = filtered.filter(item => item.category === 'vehicles');
      } else if (filters.category === 'electronics') {
        filtered = filtered.filter(item => item.category === 'electronics' || item.category === 'smartphones');
      } else if (filters.category === 'appliances') {
        filtered = filtered.filter(item => item.category === 'appliances');
      } else if (filters.category === 'parts') {
        filtered = filtered.filter(item => item.category === 'parts');
      } else {
        filtered = filtered.filter(item => item.category === filters.category);
      }
    }

    // Filtre par marque
    if (filters.brand !== 'all') {
      filtered = filtered.filter(item => item.brand === filters.brand);
    }

    // Filtre par prix
    filtered = filtered.filter(item => 
      item.price_krw >= filters.priceRange[0] && 
      item.price_krw <= filters.priceRange[1]
    );

    // Filtre par stock (pour les pièces)
    if (filters.inStock && selectedVehicleId) {
      filtered = filtered.filter(item => 
        (item as Part).stock_quantity && (item as Part).stock_quantity! > 0
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (filters.sortBy) {
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

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [rawProducts, filters, selectedVehicleId, displayData]);

  // Appliquer la pagination locale aux produits filtrés
  const products = useMemo(() => {
    const startIndex = currentPage * 12;
    const endIndex = startIndex + 12;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

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
    // Réinitialiser les filtres
    setFilters({
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

  // Gérer les filtres avec feedback
  const handleFiltersChange = (newFilters: FilterState) => {
    setIsFiltering(true);
    setFilters(newFilters);
    setCurrentPage(0);
    
    // Synchroniser activeCategory avec la catégorie des filtres
    if (newFilters.category !== activeCategory) {
      setActiveCategory(newFilters.category);
    }
    
    // Réinitialiser le sélecteur de véhicule si on change de catégorie (sauf pour 'parts')
    if (newFilters.category !== filters.category && newFilters.category !== 'parts') {
      setSelectedVehicleId(null);
    }
    
    // Feedback utilisateur pour les changements de filtres
    const changes = [];
    if (newFilters.search !== filters.search) changes.push('recherche');
    if (newFilters.category !== filters.category) changes.push('catégorie');
    if (newFilters.brand !== filters.brand) changes.push('marque');
    if (newFilters.priceRange[0] !== filters.priceRange[0] || newFilters.priceRange[1] !== filters.priceRange[1]) changes.push('prix');
    if (newFilters.inStock !== filters.inStock) changes.push('stock');
    if (newFilters.sortBy !== filters.sortBy || newFilters.sortOrder !== filters.sortOrder) changes.push('tri');
    
    if (changes.length > 0) {
      toast({
        title: "Filtres mis à jour",
        description: `Filtres modifiés: ${changes.join(', ')}`,
      });
    }

    // Simuler un délai de filtrage pour l'UX
    setTimeout(() => {
      setIsFiltering(false);
    }, 300);
  };

  // Réinitialiser les filtres avec confirmation
  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      brand: 'all',
      priceRange: [0, maxPrice],
      inStock: false,
      sortBy: 'name',
      sortOrder: 'asc',
    });
    setCurrentPage(0);
    setActiveCategory('all');
    setSearchError(null);
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été remis à zéro",
    });
  };

  // Gérer le changement de mode d'affichage
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    toast({
      title: "Mode d'affichage changé",
      description: `Affichage en mode ${mode === 'grid' ? 'grille' : 'liste'}`,
    });
  };

  // Gérer la pagination avec feedback
  const handlePageChange = (direction: 'prev' | 'next') => {
    const totalPages = Math.ceil(filteredAndSortedProducts.length / 12);
    
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
      toast({
        title: "Page précédente",
        description: `Page ${currentPage}`,
      });
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      toast({
        title: "Page suivante",
        description: `Page ${currentPage + 2}`,
      });
    }
  };

  // Gérer l'ajout au panier avec validation et feedback
  const handleAddToCart = (item: BasicItem | Part) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Validation des données du produit
      if (!item.id || !item.name || !item.price_krw) {
        toast({
          title: "Erreur de produit",
          description: "Les informations du produit sont incomplètes",
          variant: "destructive",
        });
        return;
      }

      // Validation de compatibilité pour les pièces automobiles
      if (selectedVehicleId && item.part_number) {
        const compatibility = vehicleCompatibilityService.checkCompatibility(selectedVehicleId, item.id);
        
        if (!compatibility.isCompatible) {
          toast({
            title: "Pièce incompatible",
            description: compatibility.reason || "Cette pièce n'est pas compatible avec le véhicule sélectionné",
            variant: "destructive",
          });
          
          if (compatibility.alternatives && compatibility.alternatives.length > 0) {
            toast({
              title: "Alternatives disponibles",
              description: `${compatibility.alternatives.length} pièce(s) alternative(s) trouvée(s)`,
            });
          }
          return;
        }

        // Validation du stock
        const stockInfo = vehicleCompatibilityService.getStockInfo(item.id);
        if (!stockInfo.inStock) {
          toast({
            title: "Pièce en rupture de stock",
            description: "Cette pièce n'est actuellement pas disponible",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Cast vers Product pour le panier local
      const product = item as Product;
      addToCart(product);
      
      toast({
        title: "✅ Produit ajouté au panier",
        description: `${product.name} - ${formatPrice(product.price_krw)}`,
      });
      
    } catch (error) {
      toast({
        title: "Erreur d'ajout au panier",
        description: "Une erreur est survenue lors de l'ajout au panier",
        variant: "destructive",
      });
    }
  };

  // Gérer la commande directe avec validation et états de chargement
  const handleOrderNow = async (item: BasicItem | Part) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour passer une commande",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validation des données du produit
      if (!item.id || !item.name || !item.price_krw) {
        toast({
          title: "Erreur de produit",
          description: "Les informations du produit sont incomplètes",
          variant: "destructive",
        });
        return;
      }

      // Calculer le prix final (simplifié pour la démo)
      const shippingCost = 50000; // KRW
      const customsRate = 0.2; // 20%
      const customsCost = item.price_krw * customsRate;
      const totalKrw = item.price_krw + shippingCost + customsCost;
      const finalPriceXaf = Math.round(totalKrw * 0.65); // Conversion KRW vers XAF

      // Afficher un toast de confirmation avant la commande
      toast({
        title: "🛒 Commande en cours...",
        description: `Commande de ${item.name} - ${formatPrice(finalPriceXaf)} XAF`,
      });

      // Créer la commande
      createOrder.mutate({
        product_id: item.id,
        quantity: 1,
        unit_price_krw: item.price_krw,
        total_price_krw: item.price_krw,
        shipping_cost_krw: shippingCost,
        customs_cost_krw: customsCost,
        final_price_xaf: finalPriceXaf,
        status: 'pending',
      }, {
        onSuccess: () => {
          toast({
            title: "✅ Commande créée avec succès",
            description: `Votre commande pour ${item.name} a été enregistrée`,
          });
        },
        onError: (error) => {
          toast({
            title: "❌ Erreur de commande",
            description: "Une erreur est survenue lors de la création de la commande",
            variant: "destructive",
          });
        }
      });

    } catch (error) {
      toast({
        title: "Erreur de commande",
        description: "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    }
  };

  // Gérer la recherche avec états de chargement et d'erreur
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setIsSearching(true);
    
    try {
      // Simuler un délai de recherche pour l'UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validation de la recherche
      if (filters.search.trim().length < 2) {
        setSearchError('Veuillez saisir au moins 2 caractères pour la recherche');
        return;
      }
      
      setCurrentPage(0); // Reset à la première page
      
      toast({
        title: "Recherche effectuée",
        description: `Recherche pour "${filters.search}"`,
      });
      
    } catch (error) {
      setSearchError('Erreur lors de la recherche');
      toast({
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Gérer la recherche en temps réel
  const handleSearchInputChange = (value: string) => {
    setSearchError(null);
    
    // Mettre à jour les filtres avec la nouvelle valeur de recherche
    setFilters(prev => ({
      ...prev,
      search: value.trim()
    }));
    
    // Recherche en temps réel si plus de 2 caractères
    if (value.length >= 2) {
      setCurrentPage(0); // Reset à la première page
    }
  };

  // Gérer la sélection de section avec feedback
  const handleSectionSelect = (sectionId: string) => {
    setActiveCategory(sectionId);
    setCurrentPage(0);
    setSearchError(null);
    
    // Mettre à jour les filtres
    setFilters(prev => ({
      ...prev,
      search: '',
      category: sectionId
    }));
    
    toast({
      title: "Section sélectionnée",
      description: `Affichage de la section: ${sectionId === 'all' ? 'Toutes catégories' : sectionId}`,
    });
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
            <Button 
              variant="outline" 
              size="sm" 
              className="relative"
              onClick={() => {
                if (getCartCount() > 0) {
                  toast({
                    title: "Panier",
                    description: `${getCartCount()} article(s) dans le panier`,
                  });
                } else {
                  toast({
                    title: "Panier vide",
                    description: "Ajoutez des produits au panier",
                  });
                }
              }}
            >
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
            {isFiltering ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                Filtrage...
              </>
            ) : (
              `${filteredAndSortedProducts.length} produits`
            )}
          </Badge>
        </DesktopHeader>

        <div className="p-4 lg:px-6">
          {/* Banner d'erreur non bloquante */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-destructive flex-1">
                Erreur lors du chargement des produits. 
                {retryCount > 0 && ` (Tentative ${retryCount}/3)`}
                Vous pouvez réessayer ou sélectionner un véhicule pour voir les pièces compatibles.
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                disabled={isRetrying || retryCount >= 3}
                className="ml-auto"
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Reconnexion...
                  </>
                ) : retryCount >= 3 ? (
                  'Max atteint'
                ) : (
                  'Réessayer'
                )}
              </Button>
            </div>
          )}
        </div>

                {/* Sections organisées de la boutique */}
                <BoutiqueSections 
                  onSectionSelect={handleSectionSelect}
                  activeSection={activeCategory}
                />

        <div className="p-6 space-y-6">
          {/* Sélecteur de véhicule - seulement pour les pièces automobiles */}
          {filters.category === 'parts' && (
            <>
              <VehicleSelector onVehicleSelect={handleVehicleSelect} />
              
              {selectedVehicleId && (
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedVehicleId(null)}
                  >
                    Voir toutes les pièces
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Filtres spécifiques par catégorie */}
          {filters.category === 'all' && (
            <div className="bg-gray-50 dark:bg-gray-950/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                🌟 Filtres pour Toutes Catégories
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={filters.brand === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'all'})}
                >
                  Toutes marques
                </Button>
                <Button 
                  variant={filters.brand === 'Samsung' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'Samsung'})}
                >
                  Samsung
                </Button>
                <Button 
                  variant={filters.brand === 'LG' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'LG'})}
                >
                  LG
                </Button>
                <Button 
                  variant={filters.brand === 'Hyundai' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'Hyundai'})}
                >
                  Hyundai
                </Button>
                <Button 
                  variant={filters.brand === 'Kia' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'Kia'})}
                >
                  Kia
                </Button>
              </div>
            </div>
          )}

          {filters.category === 'vehicles' && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🚗 Filtres pour Véhicules Coréens
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={filters.brand === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'all'})}
                >
                  Toutes marques
                </Button>
                <Button 
                  variant={filters.brand === 'Hyundai' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'Hyundai'})}
                >
                  Hyundai
                </Button>
                <Button 
                  variant={filters.brand === 'Kia' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'Kia'})}
                >
                  Kia
                </Button>
                <Button 
                  variant={filters.brand === 'Genesis' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'Genesis'})}
                >
                  Genesis
                </Button>
              </div>
            </div>
          )}

          {filters.category === 'electronics' && (
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                📱 Filtres pour Électronique Coréenne
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={filters.brand === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'all'})}
                >
                  Toutes marques
                </Button>
                <Button 
                  variant={filters.brand === 'Samsung' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'Samsung'})}
                >
                  Samsung
                </Button>
                <Button 
                  variant={filters.brand === 'LG' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'LG'})}
                >
                  LG
                </Button>
              </div>
            </div>
          )}

          {filters.category === 'appliances' && (
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                🏠 Filtres pour Électroménager Coréen
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={filters.brand === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'all'})}
                >
                  Toutes marques
                </Button>
                <Button 
                  variant={filters.brand === 'Samsung' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'Samsung'})}
                >
                  Samsung
                </Button>
                <Button 
                  variant={filters.brand === 'LG' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'LG'})}
                >
                  LG
                </Button>
              </div>
            </div>
          )}

          {filters.category === 'parts' && (
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                🔧 Filtres pour Pièces Automobiles
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={filters.brand === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'all'})}
                >
                  Toutes marques
                </Button>
                <Button 
                  variant={filters.brand === 'Hyundai' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'Hyundai'})}
                >
                  Hyundai
                </Button>
                <Button 
                  variant={filters.brand === 'Kia' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'Kia'})}
                >
                  Kia
                </Button>
                <Button 
                  variant={filters.brand === 'Genesis' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFiltersChange({...filters, brand: 'Genesis'})}
                >
                  Genesis
                </Button>
              </div>
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
                    placeholder={`Rechercher ${filters.category === 'parts' ? 'des pièces' : filters.category === 'vehicles' ? 'des véhicules' : filters.category === 'electronics' ? 'de l\'électronique' : filters.category === 'appliances' ? 'de l\'électroménager' : 'des produits'}...`}
                    value={filters.search}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    className="pl-10"
                    disabled={isSearching}
                  />
                </div>
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Recherche...
                    </>
                  ) : (
                    'Rechercher'
                  )}
                </Button>
              </form>
              
              {/* Message d'erreur de recherche */}
              {searchError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {searchError}
                </div>
              )}
              
              <div className="flex gap-2">
                        <Select value={activeCategory} onValueChange={handleSectionSelect}>
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
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
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
                          onClick={() => handleViewModeChange('grid')}
                          className="rounded-r-none"
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => handleViewModeChange('list')}
                          className="rounded-l-none"
                        >
                          <List className="h-4 w-4" />
                        </Button>
              </div>
              
              <Badge variant="secondary" className="text-sm">
                {isFiltering ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    Filtrage...
                  </>
                ) : (
                  `${filteredAndSortedProducts.length} ${selectedVehicleId ? 'pièces' : 'produits'}`
                )}
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
              // Utiliser VehicleCard pour les véhicules
              if (filters.category === 'vehicles') {
                // Chercher d'abord dans les véhicules de Supabase
                const supabaseVehicle = (vehiclesData as any)?.data?.find((v: any) => v.id === product.id);
                // Puis dans les véhicules mockés
                const mockVehicle = koreanVehicles.find(v => v.id === product.id);
                
                let vehicle = supabaseVehicle || mockVehicle;
                
                // Si c'est un véhicule de Supabase, le convertir au format KoreanVehicle
                if (supabaseVehicle && !mockVehicle) {
                  vehicle = {
                    id: supabaseVehicle.id,
                    name: supabaseVehicle.name,
                    brand: supabaseVehicle.brand,
                    model: supabaseVehicle.model,
                    year: supabaseVehicle.year || 2024,
                    category: 'vehicles',
                    price_krw: supabaseVehicle.final_price_fcfa || supabaseVehicle.supplier_price_fcfa || 0,
                    image_url: supabaseVehicle.images?.[0] || '/placeholder-car.svg',
                    description: supabaseVehicle.description || '',
                    specifications: supabaseVehicle.specifications || {
                      engine: 'Non spécifié',
                      transmission: 'Non spécifié',
                      fuelType: 'Non spécifié',
                      power: 'Non spécifié',
                      torque: 'Non spécifié',
                      acceleration: 'Non spécifié',
                      topSpeed: 'Non spécifié',
                      fuelConsumption: 'Non spécifié',
                      seating: 5,
                      drivetrain: 'Non spécifié'
                    },
                    features: supabaseVehicle.features || [],
                    in_stock: supabaseVehicle.status === 'active',
                    stock_quantity: 1
                  };
                }
                
                if (vehicle) {
                  return (
                    <VehicleCard
                      key={product.id}
                      vehicle={vehicle}
                      onOrder={handleOrderNow}
                      onViewDetails={(vehicle) => {
                        toast({
                          title: "Détails du véhicule",
                          description: `${vehicle.name} - ${vehicle.specifications?.engine || 'Moteur non spécifié'}`,
                        });
                      }}
                    />
                  );
                }
              }
              
              // Utiliser PartCard pour les pièces automobiles
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
                // Utiliser ProductCard pour les autres produits
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

                  {/* Pagination avec feedback */}
                  {filteredAndSortedProducts.length > 12 && (
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange('prev')}
                        disabled={currentPage === 0}
                      >
                        Précédent
                      </Button>
                      <span className="flex items-center px-4 text-sm text-muted-foreground">
                        Page {currentPage + 1} sur {Math.ceil(filteredAndSortedProducts.length / 12)}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange('next')}
                        disabled={currentPage >= Math.ceil(filteredAndSortedProducts.length / 12) - 1}
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
