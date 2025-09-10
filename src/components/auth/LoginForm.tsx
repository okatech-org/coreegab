import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Lock, Eye, EyeOff, User, Crown, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { demoAccounts } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState<string | null>(null);
  const { signIn, signInDemo } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (!error) {
        // La redirection sera gérée par le contexte d'auth
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'client' | 'commercial' | 'admin') => {
    setIsDemoLoading(role);
    try {
      const { error } = await signInDemo(role);
      
      if (!error) {
        // Redirect to appropriate dashboard
        const routes = {
          client: '/client-dashboard',
          commercial: '/commercial-dashboard',
          admin: '/admin-dashboard'
        };
        
        setTimeout(() => {
          window.location.href = routes[role];
        }, 1500);
      }
    } finally {
      setIsDemoLoading(null);
    }
  };

  const roleConfig = {
    client: {
      icon: User,
      title: 'Client',
      description: 'Parcourir et commander',
      color: 'bg-blue-500'
    },
    commercial: {
      icon: Briefcase,
      title: 'Commercial',
      description: 'Gérer les ventes',
      color: 'bg-green-500'
    },
    admin: {
      icon: Crown,
      title: 'Admin',
      description: 'Administration complète',
      color: 'bg-purple-500'
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto auth-card border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Connectez-vous à votre compte COREGAB
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                className="pl-10 auth-input"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10 auth-input"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={onToggleMode}
              className="text-sm"
            >
              Pas de compte ? Créer un compte
            </Button>
          </div>
        </form>

        {/* Section Comptes Démo */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou testez en mode démo
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {Object.entries(roleConfig).map(([role, config]) => {
              const IconComponent = config.icon;
              const account = demoAccounts[role as keyof typeof demoAccounts];
              const isLoadingThisDemo = isDemoLoading === role;
              
              return (
                <Button
                  key={role}
                  variant="outline"
                  className="w-full h-auto p-4 justify-start"
                  onClick={() => handleDemoLogin(role as 'client' | 'commercial' | 'admin')}
                  disabled={isDemoLoading !== null}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{config.title}</span>
                        <Badge variant="secondary" className="text-xs">DÉMO</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {account.name} • {config.description}
                      </p>
                    </div>
                    {isLoadingThisDemo && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Accès instantané sans inscription • Toutes les fonctionnalités disponibles
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
