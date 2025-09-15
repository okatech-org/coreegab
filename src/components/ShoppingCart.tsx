import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function ShoppingCart({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}: ShoppingCartProps) {
  const [coupon, setCoupon] = useState('');
  const [shippingMethod, setShippingMethod] = useState('pickup');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState<string | null>(null);
  const { toast } = useToast();

  const calculateTotals = () => {
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = shippingMethod === 'delivery' ? 15000 : 0;
    const discount = coupon === 'COREEGAB10' ? subtotal * 0.1 : 0;
    
    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount
    };
  };

  const totals = calculateTotals();

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    
    setIsApplyingCoupon(true);
    
    try {
      // Simuler une validation serveur
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (coupon === 'COREEGAB10') {
        toast({
          title: "Code promo appliqué",
          description: "10% de réduction ajoutée !",
        });
      } else {
        toast({
          title: "Code promo invalide",
          description: "Vérifiez votre code et réessayez",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de valider le code promo",
        variant: "destructive",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity < 0) {
      toast({
        title: "Quantité invalide",
        description: "La quantité ne peut pas être négative",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdatingQuantity(id);
    
    try {
      // Simuler une mise à jour serveur
      await new Promise(resolve => setTimeout(resolve, 500));
      onUpdateQuantity(id, quantity);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingQuantity(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">
              Découvrez nos produits et ajoutez-les à votre panier
            </p>
            <Button onClick={() => window.location.href = '/boutique'}>
              Explorer la boutique
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mon Panier</h1>
        <p className="text-muted-foreground">
          {items.length} article{items.length > 1 ? 's' : ''} dans votre panier
        </p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Liste des produits */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg" 
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-muted-foreground text-sm">{item.brand}</p>
                    <p className="text-xl font-bold text-primary mt-2">
                      {item.price.toLocaleString()} FCFA
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    {/* Contrôles quantité */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={isUpdatingQuantity === item.id}
                      >
                        {isUpdatingQuantity === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                        min="1"
                        disabled={isUpdatingQuantity === item.id}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isUpdatingQuantity === item.id}
                      >
                        {isUpdatingQuantity === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Bouton supprimer */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    {/* Sous-total */}
                    <p className="text-lg font-semibold">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Récapitulatif */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Récapitulatif de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Code promo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Code promo</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: COREEGAB10"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  />
                  <Button 
                    variant="outline" 
                    onClick={applyCoupon}
                    disabled={isApplyingCoupon || !coupon.trim()}
                  >
                    {isApplyingCoupon ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Validation...
                      </>
                    ) : (
                      'Appliquer'
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Méthode de livraison */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Livraison</label>
                <Select value={shippingMethod} onValueChange={setShippingMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">
                      <div className="flex justify-between w-full">
                        <span>Retrait en magasin</span>
                        <Badge variant="secondary">Gratuit</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="delivery">
                      <div className="flex justify-between w-full">
                        <span>Livraison à domicile</span>
                        <span>15,000 FCFA</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Totaux */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{totals.subtotal.toLocaleString()} FCFA</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{totals.shipping.toLocaleString()} FCFA</span>
                </div>
                
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction (10%)</span>
                    <span>-{totals.discount.toLocaleString()} FCFA</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">{totals.total.toLocaleString()} FCFA</span>
                </div>
              </div>

              <Button onClick={onCheckout} className="w-full mt-6" size="lg">
                Procéder au Paiement
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Paiement sécurisé • Livraison rapide
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}