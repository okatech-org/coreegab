// ====== TYPES ET INTERFACES POUR LES PRODUITS UNIFIÉS ======

// Type de produit dans notre système unifié
export type ProductType = 'vehicle' | 'part' | 'electronics' | 'appliance' | 'other';

// Interface de base pour tous les produits
export interface BaseProduct {
  id: string;
  name: string;
  name_kr?: string;
  description?: string;
  description_kr?: string;
  product_type: ProductType;
  category: string;
  subcategory?: string;
  tags?: string[];
  
  // Prix et stock
  price_krw: number;
  price_original_krw?: number;
  price_fcfa?: number;
  price_original_fcfa?: number;
  in_stock: boolean;
  stock_quantity: number;
  stock_location?: string;
  lead_time_days?: number;
  
  // Médias
  images?: string[];
  thumbnail_url?: string;
  videos?: string[];
  documents?: Record<string, string>;
  
  // Caractéristiques et spécifications
  specifications?: Record<string, any>;
  features?: string[];
  colors_available?: string[];
  
  // Promotion et marketing
  is_featured?: boolean;
  is_promotion?: boolean;
  promotion_end_date?: string;
  badge_text?: string;
  
  // Performance
  view_count?: number;
  order_count?: number;
  rating?: number;
  review_count?: number;
  
  // Métadonnées
  import_date?: string;
  supplier_id?: string;
  status?: 'active' | 'inactive' | 'discontinued' | 'coming_soon';
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

// Interface spécifique pour les véhicules
export interface VehicleProduct extends BaseProduct {
  product_type: 'vehicle';
  brand: string;
  model: string;
  year?: number;
  trim_level?: string;
  vehicle_type?: string;
  engine_type?: string;
  engine_size?: number;
  transmission?: string;
  drivetrain?: string;
  fuel_economy?: {
    city: number;
    highway: number;
    combined: number;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
  };
  weight?: number;
  seating_capacity?: number;
  cargo_capacity?: number;
}

// Interface spécifique pour les pièces
export interface PartProduct extends BaseProduct {
  product_type: 'part';
  part_number?: string;
  oem_number?: string;
  compatible_vehicles?: string[];
  compatible_models?: string[];
  part_category?: string;
  is_genuine?: boolean;
  warranty_months?: number;
}

// Interface spécifique pour l'électronique et l'électroménager
export interface ElectronicsProduct extends BaseProduct {
  product_type: 'electronics' | 'appliance';
  manufacturer?: string;
  model_number?: string;
  power_consumption?: number;
  energy_rating?: string;
  warranty_years?: number;
}

// Type union pour tous les produits
export type UnifiedProduct = VehicleProduct | PartProduct | ElectronicsProduct | BaseProduct;

// Filtres de recherche
export interface ProductFilters {
  product_type?: ProductType;
  category?: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  year?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  search_query?: string;
  tags?: string[];
  compatible_vehicle_id?: string;
  limit?: number;
  offset?: number;
}

// Résultat de recherche avec métadonnées
export interface ProductSearchResult {
  products: UnifiedProduct[];
  total: number;
  hasMore: boolean;
  filters: ProductFilters;
}

// Statistiques de produit
export interface ProductStatistics {
  product_type: string;
  category: string;
  total_count: number;
  in_stock_count: number;
  avg_price_fcfa: number;
  avg_rating: number;
  total_views: number;
  total_orders: number;
}

// Configuration du taux de change
export interface ExchangeRateConfig {
  KRW_TO_FCFA: number;
  margin: number;
}

// Options de tri
export type SortOption = 
  | 'name_asc' 
  | 'name_desc' 
  | 'price_asc' 
  | 'price_desc' 
  | 'rating_desc' 
  | 'created_desc' 
  | 'featured_first';

// Options de pagination
export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

// Résultat paginé
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Erreur personnalisée du service
export class ProductServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ProductServiceError';
  }
}

// Type pour les données d'importation
export interface ImportProductData {
  name: string;
  name_kr?: string;
  description?: string;
  description_kr?: string;
  product_type: ProductType;
  category: string;
  subcategory?: string;
  price_krw: number;
  price_original_krw?: number;
  in_stock?: boolean;
  stock_quantity?: number;
  images?: string[];
  // Champs spécifiques selon le type
  [key: string]: any;
}

// Type pour les métadonnées d'importation
export interface ImportMetadata {
  source: string;
  imported_at: string;
  imported_by?: string;
  total_imported: number;
  errors: string[];
}
