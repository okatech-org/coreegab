import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'client' | 'commercial' | 'admin';

interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInDemo: (role: UserRole) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  isAdmin: boolean;
  isCommercial: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Vérifier les sessions démo
  const checkDemoSession = useCallback(() => {
    const isDemo = localStorage.getItem('isDemo') === 'true';
    const userRole = localStorage.getItem('userRole') as UserRole;
    
    if (isDemo && userRole) {
      const demoProfile: Profile = {
        id: 'demo-user',
        email: `demo-${userRole}@coregab.com`,
        name: `Utilisateur Démo ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`,
        role: userRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const demoUser = {
        id: 'demo-user',
        email: demoProfile.email,
      } as User;
      
      setUser(demoUser);
      setProfile(demoProfile);
      return true;
    }
    return false;
  }, []);

  // Charger le profil utilisateur
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Créer un profil après inscription
  const createProfile = async (user: User, name: string, role: UserRole = 'client') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: user.email!,
            name,
            role,
          }
        ]);

      if (error) {
        console.error('Error creating profile:', error);
        return;
      }

      await loadProfile(user.id);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  // Inscription
  const signUp = async (email: string, password: string, name: string, role: UserRole = 'client') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });

      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        await createProfile(data.user, name, role);
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte.",
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  // Connexion
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        await loadProfile(data.user.id);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur COREEGAB !",
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  // Connexion démo
  const signInDemo = async (role: UserRole) => {
    try {
      setLoading(true);
      
      // Stocker les informations de session démo
      localStorage.setItem('userRole', role);
      localStorage.setItem('isDemo', 'true');
      
      // Créer le profil démo
      checkDemoSession();
      
      toast({
        title: `Accès Démo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        description: "Bienvenue dans l'environnement de démonstration !",
      });

      return { error: null };
    } catch (error) {
      console.error('Demo sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Vérifier si c'est une session démo
      const isDemo = localStorage.getItem('isDemo') === 'true';
      
      if (isDemo) {
        // Nettoyer la session démo
        localStorage.removeItem('isDemo');
        localStorage.removeItem('userRole');
        
        setUser(null);
        setProfile(null);
        setSession(null);
        
        toast({
          title: "Session démo terminée",
          description: "À bientôt sur COREEGAB !",
        });

        return { error: null };
      } else {
        // Déconnexion Supabase normale
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          toast({
            title: "Erreur de déconnexion",
            description: error.message,
            variant: "destructive",
          });
          return { error };
        }

        setUser(null);
        setProfile(null);
        setSession(null);
        
        toast({
          title: "Déconnexion réussie",
          description: "À bientôt sur COREEGAB !",
        });

        return { error: null };
      }
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le profil
  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) return { error: new Error('No user logged in') };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Erreur de mise à jour",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      await loadProfile(user.id);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées.",
      });

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  // Écouter les changements d'authentification
  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      // Vérifier d'abord les sessions démo
      if (checkDemoSession()) {
        setLoading(false);
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadProfile(session.user.id);
      }
      
      setLoading(false);
    };

    getSession();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        
        // Ne pas écraser les sessions démo
        const isDemo = localStorage.getItem('isDemo') === 'true';
        if (isDemo) {
          console.log('Demo session active, ignoring Supabase auth change');
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Écouter les changements dans localStorage pour maintenir les sessions démo
    const handleStorageChange = () => {
      const isDemo = localStorage.getItem('isDemo') === 'true';
      if (isDemo) {
        checkDemoSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkDemoSession]);

  // Rôles helpers
  const isAdmin = profile?.role === 'admin';
  const isCommercial = profile?.role === 'commercial';
  const isClient = profile?.role === 'client';

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signInDemo,
    signOut,
    updateProfile,
    isAdmin,
    isCommercial,
    isClient,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
