import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

  // Charger les notifications de l'utilisateur (utilisation d'un mock pour l'instant)
  const loadNotifications = async () => {
    if (!user) return;

    try {
      // Mock notifications for now since the table doesn't exist
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Bienvenue !',
          message: 'Merci de rejoindre COREEGAB',
          type: 'info',
          read: false,
          created_at: new Date().toISOString(),
          user_id: user.id
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Marquer comme lu
  const markAsRead = async (id: string) => {
    try {
      // Mock implementation for now
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      // Mock implementation for now
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Créer une notification
  const createNotification = async (
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    try {
      // Mock implementation for now
      const newNotification: Notification = {
        id: Date.now().toString(),
        user_id: userId,
        title,
        message,
        type,
        read: false,
        created_at: new Date().toISOString()
      };
      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Écouter les nouvelles notifications en temps réel
  useEffect(() => {
    if (!user) return;

    loadNotifications();

    // Mock real-time subscription for now
    // const subscription = supabase
    //   .channel('notifications')
    //   .on('postgres_changes', ...)
    //   .subscribe();

    // return () => {
    //   subscription.unsubscribe();
    // };
  }, [user, toast]);

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
