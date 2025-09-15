// src/services/unifiedProductService.ts

import { supabase } from '@/integrations/supabase/client';
import { koreanVehicles } from '@/services/koreanVehiclesData';
import { mockProducts } from '@/data/mockData';
import { mockParts } from '@/data/mockPartsData';
import { mockElectronics } from '@/data/mockElectronicsData';
import { 
  UnifiedProduct, 
  ProductType, 
  VehicleProduct, 
  PartProduct, 
  ElectronicsProduct,
  ProductFilters,
  ProductSearchResult,
  ProductStatistics,
  ExchangeRateConfig,
  SortOption,
  PaginationOptions,
  PaginatedResult,
  ProductServiceError,
  ImportProductData,
  ImportMetadata
} from '@/types/unifiedProducts';

// ====== CONFIGURATION ======

// Configuration du taux de change
const EXCHANGE_RATE: ExchangeRateConfig = {
  KRW_TO_FCFA: 0.48, // 1 KRW = 0.48 FCFA (taux approximatif)
  margin: 1.35, // Marge de 35% pour l'importation
};

// ====== SERVICE PRINCIPAL ======

class UnifiedProductService {
  // Convertir le prix de KRW en FCFA avec marge
  private convertPrice(priceKrw: number): number {
    return Math.round(priceKrw * EXCHANGE_RATE.KRW_TO_FCFA * EXCHANGE_RATE.margin);
  }

  // Enrichir un produit avec les prix calculés
  private enrichProduct<T extends UnifiedProduct>(product: T): T {
    return {
      ...product,
      price_fcfa: product.price_fcfa || this.convertPrice(product.price_krw),
      price_original_fcfa: product.price_original_krw 
        ? this.convertPrice(product.price_original_krw) 
        : undefined,
    };
  }

  // Générer un slug à partir du nom
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
      .trim('-'); // Supprimer les tirets en début/fin
  }

  // ====== MÉTHODES PRINCIPALES ======

  /**
   * Récupérer tous les produits avec filtres optionnels
   * Utilise uniquement les données mock pour éviter les erreurs Supabase
   */
  async getProducts(filters: ProductFilters = {}): Promise<UnifiedProduct[]> {
    // Utiliser directement les données mock pour éviter les erreurs Supabase
    return this.getMockProducts(filters);
  }

  /**
   * Récupérer les produits avec pagination
   */
  async getProductsPaginated(
    filters: ProductFilters = {}, 
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<UnifiedProduct>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const offset = pagination.offset || (page - 1) * limit;

    const products = await this.getProducts({
      ...filters,
      limit: limit + 1, // Récupérer un de plus pour savoir s'il y a une page suivante
      offset
    });

    const hasMore = products.length > limit;
    const data = hasMore ? products.slice(0, limit) : products;

    return {
      data,
      pagination: {
        page,
        limit,
        total: data.length + (hasMore ? 1 : 0), // Estimation approximative
        totalPages: Math.ceil((data.length + (hasMore ? 1 : 0)) / limit),
        hasNext: hasMore,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Récupérer uniquement les véhicules
   */
  async getVehicles(filters: Omit<ProductFilters, 'product_type'> = {}): Promise<VehicleProduct[]> {
    const products = await this.getProducts({ ...filters, product_type: 'vehicle' });
    return products.filter((p): p is VehicleProduct => p.product_type === 'vehicle');
  }

  /**
   * Récupérer uniquement les pièces
   */
  async getParts(filters: Omit<ProductFilters, 'product_type'> = {}): Promise<PartProduct[]> {
    const products = await this.getProducts({ ...filters, product_type: 'part' });
    return products.filter((p): p is PartProduct => p.product_type === 'part');
  }

  /**
   * Récupérer les pièces compatibles avec un véhicule spécifique
   */
  async getPartsForVehicle(vehicleId: string): Promise<PartProduct[]> {
    // Utiliser directement les données mock pour éviter les erreurs Supabase
    return this.getMockPartsForVehicle(vehicleId);
  }

  /**
   * Récupérer l'électronique et l'électroménager
   */
  async getElectronics(filters: Omit<ProductFilters, 'product_type'> = {}): Promise<ElectronicsProduct[]> {
    const products = await this.getProducts({ 
      ...filters, 
      product_type: filters.category === 'appliance' ? 'appliance' : 'electronics' 
    });
    return products.filter((p): p is ElectronicsProduct => 
      p.product_type === 'electronics' || p.product_type === 'appliance'
    );
  }

  /**
   * Récupérer un produit par son ID
   */
  async getProductById(id: string): Promise<UnifiedProduct | null> {
    // Utiliser directement les données mock pour éviter les erreurs Supabase
    return this.getMockProductById(id);
  }

  /**
   * Récupérer les produits en vedette
   */
  async getFeaturedProducts(limit: number = 8): Promise<UnifiedProduct[]> {
    return this.getProducts({ is_featured: true, limit });
  }

  /**
   * Récupérer les catégories disponibles
   */
  async getCategories(): Promise<{ category: string; count: number }[]> {
    // Utiliser directement les données mock pour éviter les erreurs Supabase
    return this.getMockCategories();
  }

  /**
   * Récupérer les marques disponibles
   */
  async getBrands(): Promise<string[]> {
    // Utiliser directement les données mock pour éviter les erreurs Supabase
    return this.getMockBrands();
  }

  /**
   * Rechercher des produits avec tri
   */
  async searchProducts(
    query: string, 
    filters: ProductFilters = {},
    sortBy: SortOption = 'featured_first'
  ): Promise<ProductSearchResult> {
    const products = await this.getProducts({
      ...filters,
      search_query: query
    });

    // Appliquer le tri
    const sortedProducts = this.sortProducts(products, sortBy);

    return {
      products: sortedProducts,
      total: sortedProducts.length,
      hasMore: false, // Simplifié pour l'instant
      filters: { ...filters, search_query: query }
    };
  }

  /**
   * Trier les produits selon l'option choisie
   */
  private sortProducts(products: UnifiedProduct[], sortBy: SortOption): UnifiedProduct[] {
    const sorted = [...products];

    switch (sortBy) {
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price_asc':
        return sorted.sort((a, b) => (a.price_fcfa || 0) - (b.price_fcfa || 0));
      case 'price_desc':
        return sorted.sort((a, b) => (b.price_fcfa || 0) - (a.price_fcfa || 0));
      case 'rating_desc':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'created_desc':
        return sorted.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
      case 'featured_first':
      default:
        return sorted.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }
  }

  // ====== MÉTHODES DE FALLBACK (DONNÉES MOCK) ======

  private getMockProducts(filters: ProductFilters): UnifiedProduct[] {
    let products: UnifiedProduct[] = [];

    // Transformer les données mock selon le type de produit demandé
    if (!filters.product_type || filters.product_type === 'vehicle') {
      products = [...products, ...this.transformVehiclesToProducts()];
    }
    if (!filters.product_type || filters.product_type === 'part') {
      products = [...products, ...this.transformPartsToProducts()];
    }
    if (!filters.product_type || filters.product_type === 'electronics' || filters.product_type === 'appliance') {
      products = [...products, ...this.transformElectronicsToProducts()];
    }

    // Appliquer les filtres
    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters.brand) {
      products = products.filter(p => 
        (p as VehicleProduct).brand?.toLowerCase() === filters.brand?.toLowerCase()
      );
    }
    if (filters.in_stock !== undefined) {
      products = products.filter(p => p.in_stock === filters.in_stock);
    }
    if (filters.search_query) {
      const query = filters.search_query.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        (p as VehicleProduct).brand?.toLowerCase().includes(query) ||
        (p as VehicleProduct).model?.toLowerCase().includes(query)
      );
    }

    // Appliquer la pagination
    const start = filters.offset || 0;
    const end = start + (filters.limit || 50);
    return products.slice(start, end);
  }

  private transformVehiclesToProducts(): VehicleProduct[] {
    return koreanVehicles.map(vehicle => ({
      id: vehicle.id,
      name: `${vehicle.brand} ${vehicle.model} ${vehicle.year || ''}`.trim(),
      description: vehicle.description,
      product_type: 'vehicle' as const,
      category: 'Véhicules',
      subcategory: vehicle.category,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      vehicle_type: vehicle.category,
      engine_type: vehicle.specifications?.engine,
      transmission: vehicle.specifications?.transmission,
      price_krw: vehicle.price_krw,
      price_fcfa: this.convertPrice(vehicle.price_krw),
      in_stock: vehicle.in_stock ?? true,
      stock_quantity: vehicle.stock_quantity ?? 0,
      images: [vehicle.image_url],
      thumbnail_url: vehicle.image_url,
      is_featured: Math.random() > 0.7, // 30% de chance d'être en vedette
      rating: Math.random() * 2 + 3, // Note entre 3 et 5
      specifications: vehicle.specifications,
      features: vehicle.features,
      slug: this.generateSlug(vehicle.name),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  private transformPartsToProducts(): PartProduct[] {
    // Transformer les nouvelles données mock de pièces
    return mockParts.map(part => ({
      id: part.id,
      name: part.name,
      name_kr: part.name_kr,
      description: part.description,
      product_type: 'part' as const,
      category: 'Pièces détachées',
      subcategory: part.category,
      part_number: part.partNumber,
      oem_number: part.oemNumber,
      compatible_vehicles: part.compatibleVehicles,
      compatible_models: part.compatibleModels,
      part_category: part.category,
      is_genuine: part.isGenuine,
      warranty_months: part.warrantyMonths,
      price_krw: part.price,
      price_fcfa: this.convertPrice(part.price),
      in_stock: part.inStock,
      stock_quantity: part.stockQuantity,
      images: part.images,
      thumbnail_url: part.images[0],
      slug: this.generateSlug(part.name),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  private transformElectronicsToProducts(): ElectronicsProduct[] {
    // Transformer les nouvelles données mock d'électronique/électroménager
    return mockElectronics.map(item => ({
      id: item.id,
      name: item.name,
      name_kr: item.name_kr,
      description: item.description,
      product_type: item.type,
      category: item.category,
      subcategory: item.subcategory,
      manufacturer: item.brand,
      model_number: item.model,
      power_consumption: item.powerConsumption,
      energy_rating: item.energyRating,
      warranty_years: item.warrantyYears,
      price_krw: item.price,
      price_fcfa: this.convertPrice(item.price),
      in_stock: item.inStock,
      stock_quantity: item.stockQuantity,
      images: item.images,
      thumbnail_url: item.images[0],
      specifications: item.specifications,
      features: item.features,
      colors_available: item.colors,
      slug: this.generateSlug(item.name),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  private getMockPartsForVehicle(vehicleId: string): PartProduct[] {
    return this.transformPartsToProducts().filter(part =>
      part.compatible_vehicles?.includes(vehicleId)
    );
  }

  private getMockProductById(id: string): UnifiedProduct | null {
    const allProducts = this.getMockProducts({});
    return allProducts.find(p => p.id === id) || null;
  }

  private getMockCategories(): { category: string; count: number }[] {
    return [
      { category: 'Véhicules', count: koreanVehicles.length },
      { category: 'Pièces détachées', count: mockParts.length },
      { category: 'Électronique', count: mockElectronics.filter(e => e.type === 'electronics').length },
      { category: 'Électroménager', count: mockElectronics.filter(e => e.type === 'appliance').length },
    ];
  }

  private getMockBrands(): string[] {
    const vehicleBrands = [...new Set(koreanVehicles.map(v => v.brand))];
    const electronicsBrands = [...new Set(mockElectronics.map(e => e.brand))];
    return [...new Set([...vehicleBrands, ...electronicsBrands])].sort();
  }

  // ====== MÉTHODES D'ADMINISTRATION ======

  /**
   * Créer un nouveau produit (admin uniquement)
   */
  async createProduct(product: Omit<UnifiedProduct, 'id' | 'created_at' | 'updated_at'>): Promise<UnifiedProduct | null> {
    try {
      const productData = {
        ...product,
        slug: product.slug || this.generateSlug(product.name),
        price_fcfa: product.price_fcfa || this.convertPrice(product.price_krw)
      };

      const { data, error } = await supabase
        .from('products_unified')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du produit:', error);
        throw new ProductServiceError('Erreur lors de la création du produit', 'CREATE_ERROR', error);
      }

      return data ? this.enrichProduct(data) : null;
    } catch (error) {
      if (error instanceof ProductServiceError) throw error;
      console.error('Erreur lors de la création du produit:', error);
      throw new ProductServiceError('Erreur lors de la création du produit', 'CREATE_ERROR', error);
    }
  }

  /**
   * Mettre à jour un produit (admin uniquement)
   */
  async updateProduct(id: string, updates: Partial<UnifiedProduct>): Promise<UnifiedProduct | null> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('products_unified')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        throw new ProductServiceError('Erreur lors de la mise à jour du produit', 'UPDATE_ERROR', error);
      }

      return data ? this.enrichProduct(data) : null;
    } catch (error) {
      if (error instanceof ProductServiceError) throw error;
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw new ProductServiceError('Erreur lors de la mise à jour du produit', 'UPDATE_ERROR', error);
    }
  }

  /**
   * Supprimer un produit (admin uniquement)
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products_unified')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        throw new ProductServiceError('Erreur lors de la suppression du produit', 'DELETE_ERROR', error);
      }

      return true;
    } catch (error) {
      if (error instanceof ProductServiceError) throw error;
      console.error('Erreur lors de la suppression du produit:', error);
      throw new ProductServiceError('Erreur lors de la suppression du produit', 'DELETE_ERROR', error);
    }
  }

  /**
   * Importer des produits en masse (admin uniquement)
   */
  async bulkImportProducts(products: ImportProductData[]): Promise<ImportMetadata> {
    const metadata: ImportMetadata = {
      source: 'bulk_import',
      imported_at: new Date().toISOString(),
      total_imported: 0,
      errors: []
    };

    try {
      // Transformer les données d'importation
      const transformedProducts = products.map(product => ({
        ...product,
        slug: this.generateSlug(product.name),
        price_fcfa: this.convertPrice(product.price_krw),
        in_stock: product.in_stock ?? true,
        stock_quantity: product.stock_quantity || 0,
        status: 'active' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('products_unified')
        .insert(transformedProducts)
        .select();

      if (error) {
        metadata.errors.push(`Erreur d'insertion: ${error.message}`);
        throw new ProductServiceError('Erreur lors de l\'import en masse', 'BULK_IMPORT_ERROR', error);
      }

      metadata.total_imported = data?.length || 0;
      return metadata;

    } catch (error) {
      if (error instanceof ProductServiceError) throw error;
      console.error('Erreur lors de l\'import en masse:', error);
      metadata.errors.push(`Erreur générale: ${error}`);
      throw new ProductServiceError('Erreur lors de l\'import en masse', 'BULK_IMPORT_ERROR', error);
    }
  }

  /**
   * Obtenir les statistiques des produits
   */
  async getProductStatistics(): Promise<ProductStatistics[]> {
    try {
      const { data, error } = await supabase
        .from('product_statistics')
        .select('*');

      if (error) {
        console.warn('Erreur lors de la récupération des statistiques:', error);
        return this.getMockStatistics();
      }

      return data || this.getMockStatistics();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return this.getMockStatistics();
    }
  }

  private getMockStatistics(): ProductStatistics[] {
    return [
      {
        product_type: 'vehicle',
        category: 'Véhicules',
        total_count: koreanVehicles.length,
        in_stock_count: koreanVehicles.filter(v => v.in_stock).length,
        avg_price_fcfa: koreanVehicles.reduce((sum, v) => sum + this.convertPrice(v.price_krw), 0) / koreanVehicles.length,
        avg_rating: 4.2,
        total_views: 1250,
        total_orders: 45
      },
      {
        product_type: 'part',
        category: 'Pièces détachées',
        total_count: mockParts.length,
        in_stock_count: mockParts.filter(p => p.inStock).length,
        avg_price_fcfa: mockParts.reduce((sum, p) => sum + this.convertPrice(p.price), 0) / mockParts.length,
        avg_rating: 4.0,
        total_views: 890,
        total_orders: 120
      },
      {
        product_type: 'electronics',
        category: 'Électronique',
        total_count: mockElectronics.filter(e => e.type === 'electronics').length,
        in_stock_count: mockElectronics.filter(e => e.type === 'electronics' && e.inStock).length,
        avg_price_fcfa: mockElectronics.filter(e => e.type === 'electronics').reduce((sum, e) => sum + this.convertPrice(e.price), 0) / mockElectronics.filter(e => e.type === 'electronics').length,
        avg_rating: 4.3,
        total_views: 2100,
        total_orders: 180
      },
      {
        product_type: 'appliance',
        category: 'Électroménager',
        total_count: mockElectronics.filter(e => e.type === 'appliance').length,
        in_stock_count: mockElectronics.filter(e => e.type === 'appliance' && e.inStock).length,
        avg_price_fcfa: mockElectronics.filter(e => e.type === 'appliance').reduce((sum, e) => sum + this.convertPrice(e.price), 0) / mockElectronics.filter(e => e.type === 'appliance').length,
        avg_rating: 4.1,
        total_views: 1650,
        total_orders: 95
      }
    ];
  }
}

// Exporter une instance unique du service
export const unifiedProductService = new UnifiedProductService();

// Exporter également la classe pour les tests ou l'extension
export default UnifiedProductService;
