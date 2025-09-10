import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  Plus,
  LogOut,
  Heart,
  Star,
  Filter,
  MapPin,
  CreditCard,
  Truck,
  Eye,
  Calculator,
  Download,
  Share2,
  Settings,
  HelpCircle,
  Shield,
  Award,
  ShoppingBag
} from 'lucide-react';
import { NewVerticalMenu } from '@/components/NewVerticalMenu';
import { useProducts } from '@/hooks/useProducts';
import { useUserOrders, useOrderStats } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';

export default function ClientDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { user, profile, signOut } = useAuth();
  const { getCartCount, addToCart, getCartItems } = useCart();
  const navigate = useNavigate();
  
  // Gérer les paramètres d'URL
  const searchParams = new URLSearchParams(window.location.search);
  const [activeView, setActiveView] = useState(searchParams.get('view') || 'dashboard');

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

  // Fonctions utilitaires
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price_krw,
      image: product.image_url,
      quantity: 1
    });
  };

  const getClientLevel = () => {
    const totalOrders = stats.total;
    if (totalOrders >= 20) return { level: 'VIP', color: 'text-purple-600', icon: Award };
    if (totalOrders >= 10) return { level: 'Premium', color: 'text-gold-600', icon: Star };
    if (totalOrders >= 5) return { level: 'Silver', color: 'text-gray-600', icon: Shield };
    return { level: 'Bronze', color: 'text-orange-600', icon: User };
  };

  const clientLevel = getClientLevel();

  // Vue Dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Bienvenue amélioré avec statut client */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-white/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {profile?.name?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold mb-1">
          Bienvenue, {profile?.name || 'Client'} !
        </h2>
                <div className="flex items-center gap-2">
                  {React.createElement(clientLevel.icon, { className: `w-5 h-5 ${clientLevel.color}` })}
                  <span className="text-blue-100">
                    Statut: {clientLevel.level}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Panier actuel</p>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="text-xl font-bold">{getCartCount()}</span>
              </div>
            </div>
          </div>
          <p className="text-blue-100 mb-4">
          Gérez vos commandes et découvrez nos nouveaux produits coréens
        </p>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate('/boutique')}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Parcourir
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate('/calculator')}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculateur
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques du client */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total commandes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-green-600">+2 ce mois</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending + stats.confirmed + stats.shipping}</p>
                <p className="text-xs text-muted-foreground">En traitement</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Livrées</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                <p className="text-xs text-green-600">100% satisfait</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Économies</p>
                <p className="text-2xl font-bold text-purple-600">{formatPrice(stats.totalValue * 0.15, 'XAF')}</p>
                <p className="text-xs text-purple-600">vs magasins locaux</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all hover:scale-105" onClick={() => navigate('/boutique')}>
          <CardContent className="p-4 text-center">
            <ShoppingBag className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">Boutique</p>
            <p className="text-xs text-muted-foreground">Nouveaux produits</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all hover:scale-105" onClick={() => setActiveView('orders')}>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">Mes commandes</p>
            <p className="text-xs text-muted-foreground">{stats.total} au total</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all hover:scale-105" onClick={() => navigate('/search')}>
          <CardContent className="p-4 text-center">
            <Search className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">Recherche IA</p>
            <p className="text-xs text-muted-foreground">Trouvez rapidement</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all hover:scale-105" onClick={() => navigate('/calculator')}>
          <CardContent className="p-4 text-center">
            <Calculator className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">Calculateur</p>
            <p className="text-xs text-muted-foreground">Prix + frais</p>
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

      {/* Produits recommandés pour vous */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Recommandés pour vous
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Basé sur vos préférences et achats précédents
            </p>
          </div>
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
                <Card key={product.id} className="hover:shadow-lg transition-all hover:scale-105 group">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden relative">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Bouton favoris */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favorites.includes(product.id) 
                              ? 'text-red-500 fill-red-500' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      </Button>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <div className="text-right">
                      <span className="font-bold text-primary text-sm">
                        {formatPrice(product.price_krw, 'KRW')}
                      </span>
                        <p className="text-xs text-muted-foreground">
                          ~{formatPrice(product.price_krw * 0.35, 'XAF')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate('/boutique')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Voir
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleAddToCart(product)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Panier
                    </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Vue Commandes améliorée
  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
        <h2 className="text-2xl font-bold">Mes commandes</h2>
          <p className="text-muted-foreground">Suivez l'état de vos achats</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        <Button onClick={() => navigate('/boutique')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle commande
        </Button>
        </div>
      </div>

      {/* Statistiques des commandes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <CardContent className="p-0">
            <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardContent className="p-0">
            <CheckCircle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Confirmées</p>
            <p className="text-xl font-bold text-blue-600">{stats.confirmed}</p>
          </CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardContent className="p-0">
            <Truck className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">En transit</p>
            <p className="text-xl font-bold text-purple-600">{stats.shipping}</p>
          </CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardContent className="p-0">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Livrées</p>
            <p className="text-xl font-bold text-green-600">{stats.delivered}</p>
          </CardContent>
        </Card>
      </div>

      {ordersLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="text-center p-12">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucune commande</h3>
            <p className="text-muted-foreground mb-6">
              Découvrez notre catalogue de produits coréens authentiques
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/boutique')} size="lg">
                <ShoppingBag className="h-4 w-4 mr-2" />
              Découvrir nos produits
            </Button>
              <Button variant="outline" onClick={() => navigate('/calculator')} size="lg">
                <Calculator className="h-4 w-4 mr-2" />
                Calculer les prix
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold">Commande #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {order.products?.image_url ? (
                      <img
                        src={order.products.image_url}
                        alt={order.products.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{order.products?.name || 'Produit'}</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantité</p>
                        <p className="font-medium">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Prix unitaire</p>
                        <p className="font-medium">{formatPrice(order.unit_price_krw, 'KRW')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Prix total</p>
                    <p className="font-bold text-xl text-primary">
                      {formatPrice(order.final_price_xaf, 'XAF')}
                    </p>
                  </div>
                </div>

                {/* Actions de commande */}
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Livraison estimée: 7-14 jours</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Détails
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Support
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Facture
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // Vue Profil
  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mon profil</h2>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {profile?.name?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{profile?.name || 'Client'}</h3>
                <p className="text-muted-foreground">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {React.createElement(clientLevel.icon, { className: `w-4 h-4 ${clientLevel.color}` })}
                  <span className="text-sm font-medium">Statut {clientLevel.level}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Membre depuis</p>
                <p className="font-medium">
                  {new Date(profile?.created_at || Date.now()).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commandes totales</p>
                <p className="font-medium">{stats.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Montant total</p>
                <p className="font-medium">{formatPrice(stats.totalValue, 'XAF')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statut et récompenses */}
        <Card>
          <CardHeader>
            <CardTitle>Statut client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              {React.createElement(clientLevel.icon, { className: `w-12 h-12 ${clientLevel.color} mx-auto mb-2` })}
              <h3 className="text-lg font-semibold">{clientLevel.level}</h3>
              <p className="text-sm text-muted-foreground">
                {stats.total >= 20 ? 'Client VIP' : 
                 stats.total >= 10 ? 'Client Premium' :
                 stats.total >= 5 ? 'Client Silver' : 'Client Bronze'}
              </p>
            </div>
            
            <Separator />
            
            {/* Progression vers le niveau suivant */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progression</span>
                <span>{stats.total}/20 commandes</span>
              </div>
              <Progress value={(stats.total / 20) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {20 - stats.total} commandes pour atteindre VIP
              </p>
            </div>
            
            <Separator />
            
            {/* Avantages */}
            <div>
              <h4 className="font-semibold mb-2">Vos avantages</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Support prioritaire</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Calculateur de prix</span>
                </div>
                {stats.total >= 5 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Réductions exclusives</span>
                  </div>
                )}
                {stats.total >= 10 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Livraison prioritaire</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Vue Favoris
  const renderFavorites = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mes favoris</h2>
          <p className="text-muted-foreground">Produits que vous avez aimés</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/boutique')}>
          <Search className="h-4 w-4 mr-2" />
          Découvrir plus
        </Button>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="text-center p-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun favori</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez des produits à vos favoris pour les retrouver facilement
            </p>
            <Button onClick={() => navigate('/boutique')}>
              Parcourir la boutique
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ici on afficherait les produits favoris */}
          <p className="text-muted-foreground col-span-full">
            Fonctionnalité en cours d'implémentation - Les favoris seront affichés ici
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full">
      <div className="fixed top-4 left-4 bottom-4 z-50 hidden lg:block">
        <NewVerticalMenu />
      </div>
      <div className="flex-1 lg:pl-[340px]">
        {/* Header amélioré */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-semibold">Espace Client</h1>
                <p className="text-sm text-muted-foreground">
                  Bienvenue, {profile?.name || 'Client'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Informations rapides */}
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4 text-blue-500" />
                  <span>{getCartCount()}</span>
                </div>
                <div className="flex items-center gap-1">
                  {React.createElement(clientLevel.icon, { className: `w-4 h-4 ${clientLevel.color}` })}
                  <span>{clientLevel.level}</span>
                </div>
              </div>
              
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={signOut}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                title="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            </div>
          </div>

        {/* Navigation par onglets */}
          <div className="p-6">
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Commandes</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Favoris</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="dashboard">
                {renderDashboard()}
              </TabsContent>
              <TabsContent value="orders">
                {renderOrders()}
              </TabsContent>
              <TabsContent value="favorites">
                {renderFavorites()}
              </TabsContent>
              <TabsContent value="profile">
                {renderProfile()}
              </TabsContent>
          </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}