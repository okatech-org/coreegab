import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Package, 
  User, 
  MessageCircle, 
  Search, 
  Bell, 
  Loader2, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useProducts } from '@/hooks/useProducts';
import { useUserOrders, useOrderStats } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';

export default function ClientDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Hooks pour les données réelles
  const { data: productsResult, isLoading: productsLoading } = useProducts({ limit: 6 });
  const { data: ordersResult, isLoading: ordersLoading } = useUserOrders({ limit: 5 });
  const { data: statsResult, isLoading: statsLoading } = useOrderStats();

  // Extraire les données
  const products = productsResult?.data || [];
  const orders = ordersResult?.data || [];
  const stats = statsResult?.data || { 
    total: 0, 
    pending: 0, 
    confirmed: 0, 
    shipping: 0, 
    delivered: 0, 
    totalValue: 0 
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
      case 'shipping': return <Package className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipping: 'En transit',
    delivered: 'Livrée'
  };

  // Vue Dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Bienvenue */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">
          Bienvenue, {profile?.name || 'Client'} !
        </h2>
        <p className="text-blue-100">
          Gérez vos commandes et découvrez nos nouveaux produits coréens
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total commandes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold">{stats.pending + stats.confirmed + stats.shipping}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Livrées</p>
                <p className="text-2xl font-bold">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valeur totale</p>
                <p className="text-2xl font-bold">{formatPrice(stats.totalValue, 'XAF')}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commandes récentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mes commandes récentes</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setActiveView('orders')}>
            Voir tout
          </Button>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center p-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Aucune commande pour le moment</p>
              <Button onClick={() => navigate('/boutique')}>
                <Plus className="h-4 w-4 mr-2" />
                Passer ma première commande
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.products?.name || 'Produit'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className={getStatusColor(order.status)}>
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPrice(order.final_price_xaf, 'XAF')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Produits recommandés */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Produits recommandés</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/boutique')}>
            Voir la boutique
          </Button>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product: any) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <span className="font-bold text-primary text-sm">
                        {formatPrice(product.price_krw, 'KRW')}
                      </span>
                    </div>
                    <Button size="sm" className="w-full mt-2" onClick={() => navigate('/boutique')}>
                      Voir détails
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Vue Commandes
  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes commandes</h2>
        <Button onClick={() => navigate('/boutique')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle commande
        </Button>
      </div>

      {ordersLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas encore passé de commande
            </p>
            <Button onClick={() => navigate('/boutique')}>
              Découvrir nos produits
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold">Commande #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    {order.products?.image_url ? (
                      <img
                        src={order.products.image_url}
                        alt={order.products.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{order.products?.name || 'Produit'}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantité: {order.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Prix unitaire: {formatPrice(order.unit_price_krw, 'KRW')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {formatPrice(order.final_price_xaf, 'XAF')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          {/* Header */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <h1 className="text-xl font-semibold">Dashboard Client</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-b">
            <div className="flex gap-4 px-4 py-2">
              <Button
                variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setActiveView('dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant={activeView === 'orders' ? 'default' : 'ghost'}
                onClick={() => setActiveView('orders')}
              >
                Mes commandes
              </Button>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6">
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'orders' && renderOrders()}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}