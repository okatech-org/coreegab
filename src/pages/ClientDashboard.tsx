import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Package, User, MessageCircle, Search, Bell } from 'lucide-react';
import { ClientSidebar } from '@/components/ClientSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const mockProducts = [
  { id: 1, name: 'Samsung Galaxy S24', price: 1200000, category: 'electronics', image: '📱', stock: 15 },
  { id: 2, name: 'Hyundai Tucson 2024', price: 25000000, category: 'vehicles', image: '🚗', stock: 3 },
  { id: 3, name: 'LG Réfrigérateur', price: 800000, category: 'appliances', image: '❄️', stock: 8 },
  { id: 4, name: 'Pièces Hyundai', price: 150000, category: 'parts', image: '⚙️', stock: 25 }
];

const mockOrders = [
  { id: 'CMD001', date: '2024-01-15', status: 'En attente', total: 1200000, items: 2 },
  { id: 'CMD002', date: '2024-01-10', status: 'En transit', total: 800000, items: 1 },
  { id: 'CMD003', date: '2024-01-05', status: 'Livré', total: 150000, items: 3 }
];

export default function ClientDashboard() {
  const [activeView, setActiveView] = useState('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<typeof mockProducts>([]);

  const addToCart = (product: typeof mockProducts[0]) => {
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
                <Card key={product.id} className="card-elevated">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 text-center">{product.image}</div>
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-4">
                      {product.price.toLocaleString()} FCFA
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <Badge variant="secondary">Stock: {product.stock}</Badge>
                      <Badge>{product.category}</Badge>
                    </div>
                    <Button 
                      onClick={() => addToCart(product)}
                      className="w-full"
                      variant="default"
                    >
                      Ajouter au panier
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Mes Commandes</h2>
            <div className="space-y-4">
              {mockOrders.map(order => (
                <Card key={order.id} className="card-elevated">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{order.total.toLocaleString()} FCFA</p>
                        <p className="text-sm text-muted-foreground">{order.items} articles</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
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
                        <span className="text-2xl">{item.image}</span>
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <p className="font-bold text-lg">{item.price.toLocaleString()} FCFA</p>
                    </CardContent>
                  </Card>
                ))}
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-6 text-center">
                    <p className="text-xl font-bold mb-4">
                      Total: {cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()} FCFA
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