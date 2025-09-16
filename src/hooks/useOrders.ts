import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, CreateOrderData, UpdateOrderData } from '@/services/orderService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Hook pour récupérer les commandes de l'utilisateur connecté
export const useUserOrders = (filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userOrders', user?.id, filters],
    queryFn: () => user ? orderService.getUserOrders(user.id, filters) : Promise.resolve({ data: null, error: null }),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook pour récupérer toutes les commandes (admin/commercial)
export const useAllOrders = (filters?: {
  status?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}) => {
  const { profile } = useAuth();
  const isAuthorized = profile?.role === 'admin' || profile?.role === 'commercial';

  return useQuery({
    queryKey: ['allOrders', filters],
    queryFn: () => orderService.getAllOrders(filters),
    enabled: isAuthorized,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook pour récupérer une commande par ID
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
};

// Hook pour créer une commande
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (orderData: Omit<CreateOrderData, 'client_id'>) => {
      if (!user) throw new Error('User not authenticated');
      
      return orderService.createOrder({
        ...orderData,
        client_id: user.id,
      });
    },
    onSuccess: (result) => {
      if (result.error) {
        toast({
          title: "Erreur",
          description: "Impossible de créer la commande",
          variant: "destructive",
        });
      } else {
        // Invalider les queries liées
        queryClient.invalidateQueries({ queryKey: ['userOrders'] });
        queryClient.invalidateQueries({ queryKey: ['allOrders'] });
        queryClient.invalidateQueries({ queryKey: ['orderStats'] });
        
        toast({
          title: "Commande créée",
          description: "Votre commande a été enregistrée avec succès",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande",
        variant: "destructive",
      });
    },
  });
};

// Hook pour mettre à jour une commande
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (orderData: UpdateOrderData) => 
      orderService.updateOrder(orderData),
    onSuccess: (result, variables) => {
      if (result.error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la commande",
          variant: "destructive",
        });
      } else {
        // Invalider les queries liées
        queryClient.invalidateQueries({ queryKey: ['userOrders'] });
        queryClient.invalidateQueries({ queryKey: ['allOrders'] });
        queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
        
        toast({
          title: "Commande mise à jour",
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

// Hook pour mettre à jour le statut d'une commande
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'confirmed' | 'shipping' | 'delivered' }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (result, variables) => {
      if (result.error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le statut",
          variant: "destructive",
        });
      } else {
        // Invalider les queries liées
        queryClient.invalidateQueries({ queryKey: ['userOrders'] });
        queryClient.invalidateQueries({ queryKey: ['allOrders'] });
        queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
        
        const statusLabels = {
          pending: 'En attente',
          confirmed: 'Confirmée',
          shipping: 'En transit',
          delivered: 'Livrée'
        };
        
        toast({
          title: "Statut mis à jour",
          description: `La commande est maintenant ${statusLabels[variables.status]}`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut",
        variant: "destructive",
      });
    },
  });
};

// Hook pour supprimer une commande
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: (result) => {
      if (result.error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la commande",
          variant: "destructive",
        });
      } else {
        // Invalider les queries
        queryClient.invalidateQueries({ queryKey: ['userOrders'] });
        queryClient.invalidateQueries({ queryKey: ['allOrders'] });
        queryClient.invalidateQueries({ queryKey: ['orderStats'] });
        
        toast({
          title: "Commande supprimée",
          description: "La commande a été supprimée avec succès",
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

// Hook pour les statistiques des commandes
export const useOrderStats = (userId?: string) => {
  const { user, profile } = useAuth();
  
  // Si pas d'userId fourni, utiliser l'utilisateur connecté
  // Si l'utilisateur est admin/commercial, peut voir toutes les stats
  const targetUserId = userId || (profile?.role === 'client' ? user?.id : undefined);

  return useQuery({
    queryKey: ['orderStats', targetUserId],
    queryFn: () => orderService.getOrderStats(targetUserId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook utilitaire pour calculer les prix
export const useOrderCalculations = () => {
  const calculateOrderPrice = (
    priceKrw: number,
    quantity: number,
    shippingCostKrw: number = 0,
    customsCostKrw: number = 0,
    exchangeRate: number = 0.65
  ) => {
    return orderService.calculateFinalPrice(
      priceKrw,
      quantity,
      shippingCostKrw,
      customsCostKrw,
      exchangeRate
    );
  };

  return { calculateOrderPrice };
};
