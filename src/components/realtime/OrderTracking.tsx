import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Bell,
  MessageCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/CurrencyContext';

interface OrderTrackingProps {
  orderId: string;
  showNotifications?: boolean;
}

interface TrackingUpdate {
  id: string;
  order_id: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered';
  location?: string;
  message: string;
  timestamp: string;
  created_at: string;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  showNotifications = true,
}) => {
  const [order, setOrder] = useState<any>(null);
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  // Charger les données de la commande
  const loadOrderData = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    
    try {
      // Charger la commande
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            id,
            name,
            image_url,
            category
          ),
          profiles (
            name,
            email
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      setOrder(orderData);

      // Simuler des mises à jour de suivi avec des données mock
      const mockTrackingData: TrackingUpdate[] = [
        {
          id: 'track-1',
          order_id: orderId,
          status: 'delivered',
          message: 'Commande livrée avec succès',
          timestamp: '2024-01-15T14:30:00Z',
          created_at: '2024-01-15T14:30:00Z',
          location: 'Libreville, Gabon'
        },
        {
          id: 'track-2',
          order_id: orderId,
          status: 'shipping',
          message: 'En transit - Arrivée prévue demain',
          timestamp: '2024-01-14T09:15:00Z',
          created_at: '2024-01-14T09:15:00Z',
          location: 'Douala, Cameroun'
        }
      ];

      setTrackingUpdates(mockTrackingData);
    } catch (error) {
      console.error('Error loading order data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations de la commande",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Écouter les mises à jour en temps réel
  useEffect(() => {
    loadOrderData();

    // Subscription pour les mises à jour de commande
    const orderSubscription = supabase
      .channel(`order_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log('Order updated:', payload);
          setOrder(payload.new);
          
          if (showNotifications) {
            toast({
              title: "Commande mise à jour",
              description: "Le statut de votre commande a été mis à jour",
            });
          }
        }
      )
      .subscribe();

    // Subscription pour les mises à jour de suivi
    const trackingSubscription = supabase
      .channel(`tracking_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_tracking',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const newUpdate = payload.new as TrackingUpdate;
          setTrackingUpdates(prev => [newUpdate, ...prev]);
          
          if (showNotifications) {
            toast({
              title: "Nouvelle mise à jour",
              description: newUpdate.message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      orderSubscription.unsubscribe();
      trackingSubscription.unsubscribe();
    };
  }, [orderId, showNotifications, toast]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadOrderData(false);
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'shipping': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'shipping': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipping': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipping: 'En transit',
    delivered: 'Livrée'
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement du suivi...</p>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Commande non trouvée</h3>
          <p className="text-muted-foreground">
            La commande #{orderId.slice(0, 8)} n'existe pas ou vous n'y avez pas accès.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête de la commande */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Commande #{order.id.slice(0, 8)}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span className="font-medium">{statusLabels[order.status as keyof typeof statusLabels]}</span>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {statusLabels[order.status as keyof typeof statusLabels]}
            </Badge>
          </div>

          <Progress value={getStatusProgress(order.status)} className="w-full" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Date de commande:</span>
              <p className="font-medium">
                {new Date(order.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Montant total:</span>
              <p className="font-medium">{formatPrice(order.final_price_xaf, 'XAF')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails du produit */}
      <Card>
        <CardHeader>
          <CardTitle>Détails de la commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              {order.products?.image_url ? (
                <img
                  src={order.products.image_url}
                  alt={order.products.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold">{order.products?.name || 'Produit'}</h3>
              <p className="text-sm text-muted-foreground">{order.products?.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm">Quantité: {order.quantity}</span>
                <span className="text-sm">Prix: {formatPrice(order.unit_price_krw, 'KRW')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historique de suivi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Suivi de la livraison
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trackingUpdates.length === 0 ? (
            <div className="text-center p-6">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucune mise à jour de suivi pour le moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {trackingUpdates.map((update, index) => (
                <div key={update.id} className="flex items-start gap-3">
                  <div className={`
                    w-3 h-3 rounded-full mt-2
                    ${index === 0 ? 'bg-primary' : 'bg-muted'}
                  `} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{update.message}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(update.timestamp).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    {update.location && (
                      <p className="text-sm text-muted-foreground mt-1">
                        📍 {update.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1">
          <MessageCircle className="w-4 h-4 mr-2" />
          Contacter le support
        </Button>
        <Button variant="outline" className="flex-1">
          <Bell className="w-4 h-4 mr-2" />
          Notifications SMS
        </Button>
      </div>
    </div>
  );
};
