import { useState, useEffect } from 'react';
import { searchProducts, getProductById, getProductCategories, getFeaturedProducts } from '@/services/unifiedProductService';
import { UnifiedProduct, ProductFilters, ProductSearchResult } from '@/types/unifiedProducts';

// Hook principal pour les produits
export const useProducts = (filters: ProductFilters = {}) => {
  const [products, setProducts] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await searchProducts(filters);
        setProducts(result.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error };
};

// Alias pour compatibilité
export const useVehicles = (filters?: ProductFilters) => useProducts({ ...filters, product_type: 'vehicle' });

// Hook pour les catégories
export const useCategories = (productType?: string) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await getProductCategories(productType as any);
        setCategories(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [productType]);

  return { categories, loading, error };
};