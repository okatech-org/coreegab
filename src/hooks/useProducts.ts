import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, CreateProductData, UpdateProductData } from '@/services/productService';
import { Product } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

// Hook pour récupérer tous les produits
export const useProducts = (filters?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer un produit par ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

// Hook pour récupérer les catégories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour la recherche de produits
export const useProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
  }>({});

  const searchResults = useQuery({
    queryKey: ['productSearch', searchQuery, filters],
    queryFn: () => productService.searchProducts(searchQuery, filters),
    enabled: searchQuery.length >= 2, // Ne chercher qu'avec au moins 2 caractères
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    ...searchResults,
  };
};

// Hook pour créer un produit (admin/commercial)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productData: CreateProductData) => 
      productService.createProduct(productData),
    onSuccess: (result) => {
      if (result.error) {
        toast({
          title: "Erreur",
          description: "Impossible de créer le produit",
          variant: "destructive",
        });
      } else {
        // Invalider et refetch les produits
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        
        toast({
          title: "Produit créé",
          description: "Le produit a été ajouté avec succès",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du produit",
        variant: "destructive",
      });
    },
  });
};

// Hook pour mettre à jour un produit
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productData: UpdateProductData) => 
      productService.updateProduct(productData),
    onSuccess: (result, variables) => {
      if (result.error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le produit",
          variant: "destructive",
        });
      } else {
        // Invalider les queries liées
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
        
        toast({
          title: "Produit mis à jour",
          description: "Les modifications ont été sauvegardées",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    },
  });
};

// Hook pour supprimer un produit
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: (result) => {
      if (result.error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le produit",
          variant: "destructive",
        });
      } else {
        // Invalider les queries
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        
        toast({
          title: "Produit supprimé",
          description: "Le produit a été supprimé avec succès",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    },
  });
};

// Hook pour gérer le panier local (avant commande)
export const useCart = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price_krw, 0);
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  };
};
