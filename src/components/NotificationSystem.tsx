import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  user_id: string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Simuler des notifications pour la démo
  const loadNotifications = async () => {
    if (!user) return;

    // Notifications factices pour la démo
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Commande confirmée',
        message: 'Votre commande Samsung Galaxy S24 a été confirmée',
        type: 'success',
        read: false,
        created_at: new Date().toISOString(),
        user_id: user.id
      },
      {
        id: '2',
        title: 'Nouveau produit disponible',
        message: 'Hyundai Tucson 2024 maintenant disponible à l\'import',
        type: 'info',
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        user_id: user.id
      }
    ];

    setNotifications(mockNotifications);
  };

  // Marquer comme lu
  const markAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    if (!user) return;

    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Charger les notifications au montage
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Composant d'affichage des notifications
export const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotifications();
  
  return (
    <div className="relative">
      <Button variant="ghost" size="sm">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </Button>
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
};