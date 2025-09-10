import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Users, DollarSign, Calendar, Bell, LogOut, User } from 'lucide-react';
import { NewVerticalMenu } from '@/components/NewVerticalMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const mockClients = [
  { id: 1, name: 'Jean Dupont', email: 'jean@email.com', phone: '+241 XX XX XX XX', orders: 5, totalSpent: 2500000 },
  { id: 2, name: 'Marie Claire', email: 'marie@email.com', phone: '+241 XX XX XX XX', orders: 3, totalSpent: 1800000 },
  { id: 3, name: 'Pierre Martin', email: 'pierre@email.com', phone: '+241 XX XX XX XX', orders: 8, totalSpent: 4200000 }
];

const mockTodayOrders = [
  { id: 'CMD004', client: 'Jean Dupont', products: 'Samsung Galaxy S24', amount: 1200000, commission: 120000 },
  { id: 'CMD005', client: 'Marie Claire', products: 'LG Réfrigérateur', amount: 800000, commission: 80000 },
  { id: 'CMD006', client: 'Pierre Martin', products: 'Pièces Hyundai', amount: 300000, commission: 30000 }
];

export default function CommercialDashboard() {
  const [commissionPrice, setCommissionPrice] = useState('');
  const { t } = useLanguage();
  const { profile, signOut } = useAuth();
  
  // Gérer les paramètres d'URL
  const searchParams = new URLSearchParams(window.location.search);
  const [activeView, setActiveView] = useState(searchParams.get('view') || 'overview');
  
  const totalSalesToday = mockTodayOrders.reduce((sum, order) => sum + order.amount, 0);
  const totalCommissionToday = mockTodayOrders.reduce((sum, order) => sum + order.commission, 0);
  const totalCommissionMonth = 850000; // Mock data
  const clientCount = mockClients.length;

  const calculateCommission = (price: number) => {
    const baseCommission = price * 0.10; // 10% commission
    const bonus = price > 1000000 ? price * 0.02 : 0; // 2% bonus for large orders
    return baseCommission + bonus;
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
                      <p className="text-sm text-muted-foreground">Ventes du jour</p>
                      <p className="text-2xl font-bold text-primary">
                        {totalSalesToday.toLocaleString()} FCFA
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
                      <p className="text-sm text-muted-foreground">Commission du mois</p>
                      <p className="text-2xl font-bold text-secondary">
                        {totalCommissionMonth.toLocaleString()} FCFA
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated bg-card border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre de clients</p>
                      <p className="text-2xl font-bold text-accent">
                        {clientCount}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated bg-card border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Commission aujourd'hui</p>
                      <p className="text-2xl font-bold text-primary">
                        {totalCommissionToday.toLocaleString()} FCFA
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-elevated bg-card border border-border">
              <CardHeader>
                <CardTitle>Commandes du Jour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTodayOrders.map(order => (
                    <div key={order.id} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-semibold">{order.id}</h4>
                        <p className="text-sm text-muted-foreground">{order.client}</p>
                        <p className="text-sm">{order.products}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.amount.toLocaleString()} FCFA</p>
                        <p className="text-sm text-secondary font-semibold">
                          Commission: {order.commission.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'neworder':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Nouvelle Commande</h2>
            <Card className="card-elevated bg-card border border-border max-w-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Client</Label>
                    <Input placeholder="Nom du client" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input placeholder="email@example.com" />
                  </div>
                </div>
                <div>
                  <Label>Produit</Label>
                  <Input placeholder="Nom du produit" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Prix (FCFA)</Label>
                    <Input type="number" placeholder="Prix en FCFA" />
                  </div>
                  <div>
                    <Label>Quantité</Label>
                    <Input type="number" placeholder="Quantité" />
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  Créer la Commande
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'clients':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Mes Clients</h2>
            <div className="space-y-4">
              {mockClients.map(client => (
                <Card key={client.id} className="card-elevated bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <p className="text-muted-foreground">{client.email}</p>
                        <p className="text-sm">{client.phone}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{client.orders} commandes</Badge>
                        <p className="font-bold text-lg mt-2">
                          {client.totalSpent.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'commission':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Calculateur de Commission</h2>
            <Card className="card-elevated bg-card border border-border max-w-lg">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label>Prix de la commande (FCFA)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 1500000"
                    value={commissionPrice}
                    onChange={(e) => setCommissionPrice(e.target.value)}
                  />
                </div>
                {commissionPrice && (
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Commission de base (10%):</span>
                      <span className="font-semibold">
                        {(parseFloat(commissionPrice) * 0.10).toLocaleString()} FCFA
                      </span>
                    </div>
                    {parseFloat(commissionPrice) > 1000000 && (
                      <div className="flex justify-between">
                        <span>Bonus commande importante (2%):</span>
                        <span className="font-semibold text-secondary">
                          {(parseFloat(commissionPrice) * 0.02).toLocaleString()} FCFA
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                      <span>Commission totale:</span>
                      <span>
                        {calculateCommission(parseFloat(commissionPrice)).toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Fonctionnalité en cours de développement</div>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="fixed top-4 left-4 bottom-4 z-50 hidden lg:block">
        <NewVerticalMenu />
      </div>
      <div className="flex-1 lg:pl-[340px]">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Dashboard Commercial</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Informations utilisateur */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{profile?.name || 'Commercial'}</span>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
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

        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold gradient-text mb-2">{t('dashboard.commercial.title')}</h1>
            <p className="text-muted-foreground">{t('dashboard.commercial.welcome')}</p>
          </div>
          
          <div className="flex gap-4 mb-6">
            <Button 
              variant={activeView === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveView('overview')}
            >
              Vue d'ensemble
            </Button>
            <Button 
              variant={activeView === 'neworder' ? 'default' : 'outline'}
              onClick={() => setActiveView('neworder')}
            >
              Nouvelle commande
            </Button>
            <Button 
              variant={activeView === 'clients' ? 'default' : 'outline'}
              onClick={() => setActiveView('clients')}
            >
              {t('dashboard.commercial.clients')}
            </Button>
            <Button 
              variant={activeView === 'commission' ? 'default' : 'outline'}
              onClick={() => setActiveView('commission')}
            >
              Commission
            </Button>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
}