import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Settings,
  Download,
  Upload,
  Bell,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { useAllOrders, useOrderStats } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useUnifiedProducts';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { SEO } from '@/components/SEO';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { StatsGridSkeleton, OrderListSkeleton } from '@/components/SkeletonLoaders';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { profile } = useAuth();
  const { formatPrice } = useCurrency();
  const mobile = useMobileOptimizations();

  // Hooks pour les données
  const { data: ordersResult, isLoading: ordersLoading } = useAllOrders({ limit: 10 });
  const { data: productsResult, isLoading: productsLoading } = useProducts({ limit: 5 });
  const { data: statsResult, isLoading: statsLoading } = useOrderStats();

  // Extraire les données
  const orders = ordersResult?.data || [];
  const products = productsResult?.data || [];
  const stats = statsResult?.data || {
    total: 0,
    pending: 0,
    confirmed: 0,
    shipping: 0,
    delivered: 0,
    totalValue: 0,
    avgOrderValue: 0
  };

  // Calculs pour le dashboard
  const totalUsers = 150; // Vous pourriez récupérer cela de Supabase
  const totalRevenue = stats.totalValue;
  const growthRate = 12.5; // Pourcentage de croissance

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipping': return <Package className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipping: 'En transit',
    delivered: 'Livrée'
  };

  // Vue d'ensemble
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Bienvenue */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">
          Bienvenue, {profile?.name} !
        </h2>
        <p className="text-purple-100">
          Tableau de bord administrateur COREEGAB
        </p>
      </div>

      {/* Statistiques principales */}
      {statsLoading ? (
        <StatsGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total commandes</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-green-600">+{growthRate}% ce mois</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenus totaux</p>
                  <p className="text-2xl font-bold">{formatPrice(totalRevenue, 'XAF')}</p>
                  <p className="text-xs text-green-600">+8.2% ce mois</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                  <p className="text-xs text-green-600">+15 nouveaux</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Produits actifs</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                  <p className="text-xs text-blue-600">Catalogue complet</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Commandes récentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Commandes récentes</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>
            Voir toutes
          </Button>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <OrderListSkeleton count={5} />
          ) : orders.length === 0 ? (
            <div className="text-center p-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune commande pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.profiles?.name || 'Client'} • {order.products?.name || 'Produit'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
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

      {/* Actions rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" onClick={() => setActiveTab('products')}>
          <Package className="w-4 h-4 mr-2" />
          Gérer produits
        </Button>
        <Button variant="outline" onClick={() => setActiveTab('orders')}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Voir commandes
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter données
        </Button>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Paramètres
        </Button>
      </div>
    </div>
  );

  // Vue des commandes
  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des commandes</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Statistiques des commandes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Confirmées</p>
            <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">En transit</p>
            <p className="text-2xl font-bold text-purple-600">{stats.shipping}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Livrées</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des commandes */}
      {ordersLoading ? (
        <OrderListSkeleton />
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold">#{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.profiles?.name} • {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{order.products?.name || 'Produit'}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantité: {order.quantity} • {order.products?.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(order.final_price_xaf, 'XAF')}</p>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="outline">
                        Voir détails
                      </Button>
                    </div>
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
    <>
      <SEO
        title="Dashboard Administrateur - COREEGAB"
        description="Interface d'administration pour la gestion de la plateforme COREEGAB"
        noIndex={true}
      />
      
      <div className="min-h-screen w-full">
          <div className="flex-1">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-semibold">Dashboard Admin</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className={cn(
              'p-4 lg:p-6',
              mobile.isMobile && 'pb-20' // Espace pour la navigation mobile
            )}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className={cn(
                  'grid w-full',
                  mobile.isMobile ? 'grid-cols-2' : 'grid-cols-4'
                )}>
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="orders">Commandes</TabsTrigger>
                  {!mobile.isMobile && <TabsTrigger value="products">Produits</TabsTrigger>}
                  {!mobile.isMobile && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {renderOverview()}
                </TabsContent>

                <TabsContent value="orders">
                  {renderOrders()}
                </TabsContent>

                <TabsContent value="products">
                  <ProductManagement />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="text-center p-8">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics avancés</h3>
                    <p className="text-muted-foreground">
                      Fonctionnalité en cours de développement
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        
      </div>
    </>
  );
}