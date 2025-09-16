import { supabase } from '@/integrations/supabase/client';
import { UnifiedProduct, ProductFilters, ProductSearchResult, ProductType, ProductServiceError } from '@/types/unifiedProducts';
import { mockElectronics } from '@/data/mockElectronicsData';
import { mockProducts } from '@/data/mockData';
import { OPEN_SOURCE_PARTS } from '@/services/openSourcePartsData';

// Configuration des taux de change
const EXCHANGE_RATES = {
  KRW_TO_FCFA: 0.65,
  margin: 1.2
};

/**
 * Service unifié pour gérer tous les types de produits
 * Combine les données de la base de données et les données mock
 */
export class UnifiedProductService {
  
  /**
   * Rechercher des produits avec filtres
   */
  async searchProducts(filters: ProductFilters = {}): Promise<ProductSearchResult> {
    try {
      // Pour l'instant, utiliser les données mock
      const allProducts = this.getAllMockProducts();
      
      let filteredProducts = allProducts;

      // Appliquer les filtres
      if (filters.product_type) {
        filteredProducts = filteredProducts.filter(p => p.product_type === filters.product_type);
      }

      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }

      if (filters.search_query) {
        const query = filters.search_query.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
        );
      }

      if (filters.min_price) {
        filteredProducts = filteredProducts.filter(p => p.price_krw >= filters.min_price!);
      }

      if (filters.max_price) {
        filteredProducts = filteredProducts.filter(p => p.price_krw <= filters.max_price!);
      }

      if (filters.in_stock !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.in_stock === filters.in_stock);
      }

      // Pagination
      const limit = filters.limit || 12;
      const offset = filters.offset || 0;
      const paginatedProducts = filteredProducts.slice(offset, offset + limit);

      return {
        products: paginatedProducts,
        total: filteredProducts.length,
        hasMore: (offset + limit) < filteredProducts.length,
        filters
      };
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw new ProductServiceError('Erreur lors de la recherche', 'SEARCH_ERROR', error);
    }
  }

  /**
   * Obtenir un produit par ID
   */
  async getProductById(id: string): Promise<UnifiedProduct | null> {
    try {
      const allProducts = this.getAllMockProducts();
      return allProducts.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      return null;
    }
  }

  /**
   * Obtenir les catégories disponibles
   */
  async getProductCategories(productType?: ProductType): Promise<string[]> {
    try {
      const allProducts = this.getAllMockProducts();
      let products = allProducts;
      
      if (productType) {
        products = products.filter(p => p.product_type === productType);
      }
      
      const categories = [...new Set(products.map(p => p.category))];
      return categories.sort();
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return [];
    }
  }

  /**
   * Obtenir les produits populaires
   */
  async getFeaturedProducts(limit: number = 8): Promise<UnifiedProduct[]> {
    try {
      const allProducts = this.getAllMockProducts();
      return allProducts
        .filter(p => p.is_featured)
        .slice(0, limit);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits populaires:', error);
      return [];
    }
  }

  /**
   * Obtenir toutes les données mock combinées
   */
  private getAllMockProducts(): UnifiedProduct[] {
    const vehicleProducts: UnifiedProduct[] = mockProducts
      .filter(p => p.category === 'vehicles')
      .map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      description: vehicle.description || '',
      product_type: 'vehicle' as ProductType,
      category: 'vehicles',
      subcategory: vehicle.category,
      price_krw: vehicle.price_krw,
      price_fcfa: Math.round(vehicle.price_krw * EXCHANGE_RATES.KRW_TO_FCFA),
      in_stock: vehicle.in_stock || true,
      stock_quantity: 1,
      thumbnail_url: vehicle.image_url || '',
      images: vehicle.image_url ? [vehicle.image_url] : [],
      specifications: {
        weight: vehicle.weight
      },
      is_featured: false,
      view_count: Math.floor(Math.random() * 1000),
      rating: 4 + Math.random(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const electronicsProducts: UnifiedProduct[] = mockElectronics.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      product_type: 'electronics' as ProductType,
      category: item.category,
      price_krw: item.price || 100000,
      price_fcfa: Math.round((item.price || 100000) * EXCHANGE_RATES.KRW_TO_FCFA),
      in_stock: item.inStock || true,
      stock_quantity: item.stockQuantity || 10,
      thumbnail_url: item.images?.[0] || '',
      images: item.images || [],
      specifications: {
        brand: item.brand,
        model: item.model,
        ...(item.specifications || {})
      },
      is_featured: item.features?.includes('featured') || false,
      view_count: Math.floor(Math.random() * 1000),
      rating: 4 + Math.random(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const partsProducts: UnifiedProduct[] = OPEN_SOURCE_PARTS.map((part, index) => ({
      id: `part-${index}`,
      name: part.name,
      description: part.description || '',
      product_type: 'part' as ProductType,
      category: 'parts',
      subcategory: part.category,
      price_krw: part.priceEstimate || 50000,
      price_fcfa: Math.round((part.priceEstimate || 50000) * EXCHANGE_RATES.KRW_TO_FCFA),
      in_stock: true,
      stock_quantity: 10,
      thumbnail_url: '',
      images: [],
      specifications: {
        part_number: part.partNumber,
        oem_number: part.oemNumber,
        brand: part.brand,
        compatible_vehicles: part.compatibleVehicles
      },
      is_featured: false,
      view_count: Math.floor(Math.random() * 500),
      rating: 3.5 + Math.random() * 1.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    return [...vehicleProducts, ...electronicsProducts, ...partsProducts];
  }
}

// Instance singleton
export const unifiedProductService = new UnifiedProductService();

// Fonctions utilitaires exportées
export const searchProducts = (filters?: ProductFilters) => 
  unifiedProductService.searchProducts(filters);

export const getProductById = (id: string) => 
  unifiedProductService.getProductById(id);

export const getProductCategories = (productType?: ProductType) => 
  unifiedProductService.getProductCategories(productType);

export const getFeaturedProducts = (limit?: number) => 
  unifiedProductService.getFeaturedProducts(limit);

export default unifiedProductService;