// src/hooks/useUnifiedProducts.ts

import { useState, useEffect, useCallback } from 'react';
import { 
  unifiedProductService, 
  UnifiedProduct, 
  ProductFilters, 
  ProductSearchResult,
  PaginationOptions,
  PaginatedResult
} from '@/services/unifiedProductService';

// Hook pour récupérer tous les produits
export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await unifiedProductService.getProducts(filters);
      setProducts(data);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors de la récupération des produits:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

// Hook pour la pagination
export function useProductsPaginated(
  filters: ProductFilters = {},
  pagination: PaginationOptions = {}
) {
  const [result, setResult] = useState<PaginatedResult<UnifiedProduct> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await unifiedProductService.getProductsPaginated(filters, pagination);
      setResult(data);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors de la récupération des produits paginés:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters), JSON.stringify(pagination)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { result, loading, error, refetch: fetchProducts };
}

// Hook pour la recherche
export function useProductSearch(
  query: string = '',
  filters: ProductFilters = {}
) {
  const [searchResult, setSearchResult] = useState<ProductSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (searchQuery: string, searchFilters: ProductFilters = {}) => {
    if (!searchQuery.trim()) {
      setSearchResult(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await unifiedProductService.searchProducts(searchQuery, searchFilters);
      setSearchResult(result);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors de la recherche:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    if (query.trim()) {
      search(query, filters);
    }
  }, [query, filters, search]);

  return { searchResult, loading, error, search };
}

// Hook pour les véhicules
export function useVehicles(filters: Omit<ProductFilters, 'product_type'> = {}) {
  const [vehicles, setVehicles] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await unifiedProductService.getVehicles(filters);
      setVehicles(data);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors de la récupération des véhicules:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
}

// Hook pour les pièces
export function useParts(filters: Omit<ProductFilters, 'product_type'> = {}) {
  const [parts, setParts] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchParts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await unifiedProductService.getParts(filters);
      setParts(data);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors de la récupération des pièces:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  return { parts, loading, error, refetch: fetchParts };
}

// Hook pour l'électronique
export function useElectronics(filters: Omit<ProductFilters, 'product_type'> = {}) {
  const [electronics, setElectronics] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchElectronics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await unifiedProductService.getElectronics(filters);
      setElectronics(data);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors de la récupération de l\'électronique:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchElectronics();
  }, [fetchElectronics]);

  return { electronics, loading, error, refetch: fetchElectronics };
}

// Hook pour un produit spécifique
export function useProduct(id: string) {
  const [product, setProduct] = useState<UnifiedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await unifiedProductService.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors de la récupération du produit:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
}

// Hook pour les produits en vedette
export function useFeaturedProducts(limit: number = 8) {
  const [featuredProducts, setFeaturedProducts] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await unifiedProductService.getFeaturedProducts(limit);
      setFeaturedProducts(data);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors de la récupération des produits en vedette:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return { featuredProducts, loading, error, refetch: fetchFeaturedProducts };
}

// Hook pour les catégories
export function useCategories() {
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await unifiedProductService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors de la récupération des catégories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

// Hook pour les marques
export function useBrands() {
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await unifiedProductService.getBrands();
      setBrands(data);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors de la récupération des marques:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return { brands, loading, error, refetch: fetchBrands };
}

// Hook pour les pièces d'un véhicule
export function useVehicleParts(vehicleId: string) {
  const [parts, setParts] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVehicleParts = useCallback(async () => {
    if (!vehicleId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await unifiedProductService.getPartsForVehicle(vehicleId);
      setParts(data);
    } catch (err) {
      setError(err as Error);
      console.error('Erreur lors de la récupération des pièces du véhicule:', err);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchVehicleParts();
  }, [fetchVehicleParts]);

  return { parts, loading, error, refetch: fetchVehicleParts };
}
