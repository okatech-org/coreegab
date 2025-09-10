import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Package, User, MessageCircle, Search, Bell } from 'lucide-react';
import { ClientSidebar } from '@/components/ClientSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ProductCard from '@/components/ProductCard';
import OrderStatus from '@/components/OrderStatus';
import { mockProducts, mockOrders, calculateFinalPrice } from '@/data/mockData';
import { Product } from '@/types/database';

// Using real mock data from mockData.ts

export default function ClientDashboard() {
  const [activeView, setActiveView] = useState('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-500';
      case 'En transit': return 'bg-blue-500';
      case 'Livré': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (activeView) {
      case 'catalog':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Catalogue Produits</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOrder={addToCart}
                  calculateFinalPrice={calculateFinalPrice}
                />
              ))}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Mes Commandes</h2>
            <div className="space-y-4">
              {mockOrders.slice(0, 3).map(order => (
                <Card key={order.id} className="card-elevated">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-muted-foreground">{order.created_at.split('T')[0]}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{order.total_price.toLocaleString()} FCFA</p>
                        <p className="text-sm text-muted-foreground">
                          {Array.isArray(order.products) ? order.products.length : 1} articles
                        </p>
                      </div>
                      <OrderStatus status={order.status} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'cart':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Mon Panier</h2>
            {cart.length === 0 ? (
              <Card className="card-elevated text-center p-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Votre panier est vide</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <Card key={index} className="card-elevated">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image_url || '/placeholder.svg'} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <p className="font-bold text-lg">{calculateFinalPrice(item).toLocaleString()} FCFA</p>
                    </CardContent>
                  </Card>
                ))}
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-6 text-center">
                    <p className="text-xl font-bold mb-4">
                      Total: {cart.reduce((sum, item) => sum + calculateFinalPrice(item), 0).toLocaleString()} FCFA
                    </p>
                    <Button variant="secondary" size="lg">
                      Finaliser la commande
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Mon Profil</h2>
            <Card className="card-elevated max-w-2xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                    <p className="text-lg font-semibold">Jean Dupont</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg">client@demo.com</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                    <p className="text-lg">+241 XX XX XX XX</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                    <p className="text-lg">Libreville, Gabon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ClientSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-border p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold gradient-text">Dashboard Client</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
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