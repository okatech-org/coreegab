import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Package,
  Truck,
  Calculator
} from 'lucide-react';
import { PaymentSystem } from '@/components/payment/PaymentSystem';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Nom complet requis'),
  address: z.string().min(5, 'Adresse complète requise'),
  city: z.string().min(2, 'Ville requise'),
  postalCode: z.string().optional(),
  phone: z.string().min(8, 'Numéro de téléphone requis'),
  email: z.string().email('Email valide requis'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface CartItem {
  id: string;
  name: string;
  price_krw: number;
  quantity: number;
  image_url?: string;
  category: string;
}

interface CheckoutFlowProps {
  cartItems: CartItem[];
  onComplete: (orderId: string) => void;
  onCancel: () => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  cartItems,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>('cart');
  const [shippingInfo, setShippingInfo] = useState<ShippingFormData | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  
  const { user, profile } = useAuth();
  const { formatPrice, convertPrice } = useCurrency();
  const createOrder = useCreateOrder();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: profile?.name || '',
      email: profile?.email || '',
    },
  });

  // Calculs de prix
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price_krw * item.quantity), 0);
  const shippingCost = 50000; // KRW fixe pour la démo
  const customsRate = 0.2;
  const customsCost = subtotal * customsRate;
  const totalKrw = subtotal + shippingCost + customsCost;
  const totalXaf = Math.round(convertPrice(totalKrw, 'KRW', 'XAF'));

  // Étape 1 : Révision du panier
  const renderCartStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Votre panier</h2>
        <Badge variant="secondary">{cartItems.length} article(s)</Badge>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={`${item.id}-${Math.random()}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm">Quantité: {item.quantity}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="font-medium">{formatPrice(item.price_krw, 'KRW')}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="font-bold">
                    {formatPrice(item.price_krw * item.quantity, 'KRW')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Résumé des coûts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Détail des coûts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Sous-total produits:</span>
            <span>{formatPrice(subtotal, 'KRW')}</span>
          </div>
          <div className="flex justify-between">
            <span>Transport:</span>
            <span>{formatPrice(shippingCost, 'KRW')}</span>
          </div>
          <div className="flex justify-between">
            <span>Douanes (20%):</span>
            <span>{formatPrice(customsCost, 'KRW')}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total KRW:</span>
            <span>{formatPrice(totalKrw, 'KRW')}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-primary">
            <span>Total XAF:</span>
            <span>{formatPrice(totalXaf, 'XAF')}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button onClick={() => setCurrentStep('shipping')} className="flex-1">
          Continuer
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Étape 2 : Informations de livraison
  const renderShippingStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Adresse de livraison</h2>
      </div>

      <form onSubmit={handleSubmit((data) => {
        setShippingInfo(data);
        setCurrentStep('payment');
      })} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              {...register('fullName')}
              placeholder="Jean Dupont"
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+241 XX XX XX XX"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="jean@example.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse complète</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="123 Rue de la Paix, Quartier Glass"
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="Libreville"
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Code postal (optionnel)</Label>
            <Input
              id="postalCode"
              {...register('postalCode')}
              placeholder="BP 1234"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setCurrentStep('cart')} 
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button type="submit" className="flex-1">
            Continuer vers le paiement
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );

  // Étape 3 : Paiement
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Paiement</h2>
      </div>

      <PaymentSystem
        amount={totalXaf}
        currency="XAF"
        orderId={orderId || `order_${Date.now()}`}
        onSuccess={async (result) => {
          // Créer la commande dans Supabase
          if (!user) return;

          try {
            for (const item of cartItems) {
              await createOrder.mutateAsync({
                products: { items: [{ id: item.id, quantity: item.quantity, name: item.name }] },
                supplier_price: item.price_krw * item.quantity,
                transport_cost: shippingCost,
                customs_cost: customsCost,
                margin: totalXaf - (item.price_krw * item.quantity + shippingCost + customsCost),
                total_price: totalXaf,
                status: 'confirmed' as any,
              });
            }

            setCurrentStep('confirmation');
            setOrderId(result.id || `order_${Date.now()}`);
          } catch (error) {
            toast({
              title: "Erreur",
              description: "Paiement réussi mais erreur lors de l'enregistrement de la commande",
              variant: "destructive",
            });
          }
        }}
        onError={(error) => {
          toast({
            title: "Erreur de paiement",
            description: error.message || "Une erreur est survenue",
            variant: "destructive",
          });
        }}
      />

      <Button 
        variant="outline" 
        onClick={() => setCurrentStep('shipping')} 
        className="w-full"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour aux informations de livraison
      </Button>
    </div>
  );

  // Étape 4 : Confirmation
  const renderConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Commande confirmée !
        </h2>
        <p className="text-muted-foreground">
          Votre commande #{orderId.slice(0, 8)} a été enregistrée avec succès
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Numéro de commande:</span>
              <span className="font-mono">#{orderId.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span>Montant total:</span>
              <span className="font-bold">{formatPrice(totalXaf, 'XAF')}</span>
            </div>
            <div className="flex justify-between">
              <span>Statut:</span>
              <Badge variant="default">Confirmée</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="text-sm text-muted-foreground p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <Truck className="w-4 h-4 inline mr-2" />
          Votre commande sera traitée sous 24-48h. Vous recevrez un email de confirmation avec le suivi.
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
            Retour à l'accueil
          </Button>
          <Button onClick={() => onComplete(orderId)} className="flex-1">
            Voir ma commande
          </Button>
        </div>
      </div>
    </div>
  );

  // Indicateur d'étapes
  const renderStepIndicator = () => {
    const steps = [
      { key: 'cart', label: 'Panier', icon: ShoppingCart },
      { key: 'shipping', label: 'Livraison', icon: MapPin },
      { key: 'payment', label: 'Paiement', icon: CreditCard },
      { key: 'confirmation', label: 'Confirmation', icon: CheckCircle },
    ];

    const currentIndex = steps.findIndex(step => step.key === currentStep);

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === currentStep;
          const isCompleted = index < currentIndex;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${isActive ? 'bg-primary text-primary-foreground' : ''}
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
              `}>
                <Icon className="w-4 h-4" />
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  w-12 h-0.5 mx-2
                  ${isCompleted ? 'bg-green-500' : 'bg-muted'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {renderStepIndicator()}
      
      <div className="min-h-[600px]">
        {currentStep === 'cart' && renderCartStep()}
        {currentStep === 'shipping' && renderShippingStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'confirmation' && renderConfirmationStep()}
      </div>
    </div>
  );
};
