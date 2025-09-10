import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3, Users, ShoppingBag, Package, TrendingUp, Bell, Settings } from 'lucide-react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const mockUsers = [
  { id: 1, name: 'Jean Dupont', email: 'jean@email.com', role: 'Client', status: 'Actif', orders: 5 },
  { id: 2, name: 'Marie Claire', email: 'marie@email.com', role: 'Commercial', status: 'Actif', sales: 15 },
  { id: 3, name: 'Pierre Martin', email: 'pierre@email.com', role: 'Client', status: 'Inactif', orders: 2 }
];

const mockProducts = [
  { id: 1, name: 'Samsung Galaxy S24', category: 'Électronique', stock: 15, price: 1200000 },
  { id: 2, name: 'Hyundai Tucson 2024', category: 'Véhicules', stock: 3, price: 25000000 },
  { id: 3, name: 'LG Réfrigérateur', category: 'Électroménager', stock: 8, price: 800000 }
];

const mockAllOrders = [
  { id: 'CMD001', client: 'Jean Dupont', commercial: 'Marie Claire', products: 2, total: 1200000, status: 'En attente', date: '2024-01-15' },
  { id: 'CMD002', client: 'Pierre Martin', commercial: 'Marie Claire', products: 1, total: 800000, status: 'En transit', date: '2024-01-14' },
  { id: 'CMD003', client: 'Jean Dupont', commercial: 'Marie Claire', products: 3, total: 150000, status: 'Livré', date: '2024-01-13' }
];

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [exchangeRate, setExchangeRate] = useState('0.45');
  const [transportRate, setTransportRate] = useState('1500');
  
  const totalRevenue = 45000000; // Mock data
  const ordersInProgress = mockAllOrders.filter(order => order.status !== 'Livré').length;
  const totalUsers = mockUsers.length;
  const totalProducts = mockProducts.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-500';
      case 'En transit': return 'bg-blue-500';
      case 'Livré': return 'bg-green-500';
      case 'Actif': return 'bg-green-500';
      case 'Inactif': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="card-elevated bg-card border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Chiffre d'affaires total</p>
                      <p className="text-2xl font-bold text-primary">
                        {totalRevenue.toLocaleString()} FCFA
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated bg-card border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Commandes en cours</p>
                      <p className="text-2xl font-bold text-accent">
                        {ordersInProgress}
                      </p>
                    </div>
                    <ShoppingBag className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated bg-card border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Utilisateurs</p>
                      <p className="text-2xl font-bold text-secondary">
                        {totalUsers}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated bg-card border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Produits en stock</p>
                      <p className="text-2xl font-bold text-primary">
                        {totalProducts}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-elevated bg-card border border-border">
                <CardHeader>
                  <CardTitle>Dernières Commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAllOrders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-semibold">{order.id}</h4>
                          <p className="text-sm text-muted-foreground">{order.client}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{order.total.toLocaleString()} FCFA</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated bg-card border border-border">
                <CardHeader>
                  <CardTitle>Performance des Commerciaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-semibold">Marie Claire</h4>
                        <p className="text-sm text-muted-foreground">Commercial</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">15 ventes</p>
                        <p className="text-sm text-secondary">Ce mois</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Gestion Utilisateurs</h2>
              <Button variant="default">Ajouter Utilisateur</Button>
            </div>
            <div className="space-y-4">
              {mockUsers.map(user => (
                <Card key={user.id} className="card-elevated bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-muted-foreground">{user.email}</p>
                        <Badge variant="secondary">{user.role}</Badge>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        <p className="text-sm">
                          {user.orders ? `${user.orders} commandes` : `${user.sales} ventes`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'products':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Gestion Produits</h2>
              <Button variant="default">Ajouter Produit</Button>
            </div>
            <div className="space-y-4">
              {mockProducts.map(product => (
                <Card key={product.id} className="card-elevated bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-muted-foreground">{product.category}</p>
                        <p className="font-bold text-primary">
                          {product.price.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={product.stock > 10 ? 'default' : 'destructive'}>
                          Stock: {product.stock}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Toutes les Commandes</h2>
            <div className="space-y-4">
              {mockAllOrders.map(order => (
                <Card key={order.id} className="card-elevated bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-muted-foreground">Client: {order.client}</p>
                        <p className="text-sm">Commercial: {order.commercial}</p>
                        <p className="text-sm">Date: {order.date}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-bold text-lg">{order.total.toLocaleString()} FCFA</p>
                        <p className="text-sm">{order.products} produits</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Paramètres Système</h2>
            <div className="space-y-6 max-w-2xl">
              <Card className="card-elevated bg-card border border-border">
                <CardHeader>
                  <CardTitle>Taux de Change</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Taux KRW vers FCFA</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      1 KRW = {exchangeRate} FCFA
                    </p>
                  </div>
                  <Button>Mettre à jour le taux</Button>
                </CardContent>
              </Card>

              <Card className="card-elevated bg-card border border-border">
                <CardHeader>
                  <CardTitle>Transport</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Prix par kg (FCFA)</Label>
                    <Input
                      type="number"
                      value={transportRate}
                      onChange={(e) => setTransportRate(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Transport: {transportRate} FCFA/kg + 50,000 FCFA de base
                    </p>
                  </div>
                  <Button>Mettre à jour les tarifs</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return <div>Fonctionnalité en cours de développement</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-card shadow-lg border-b border-border p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold gradient-text">Dashboard Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="text-sm">
                <p className="font-semibold">admin@demo.com</p>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}