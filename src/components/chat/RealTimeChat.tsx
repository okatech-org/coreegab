import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Phone, 
  Video, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Online,
  Offline,
  MessageCircle,
  Bot,
  User,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'client' | 'commercial' | 'admin' | 'bot';
  chat_id: string;
  created_at: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  metadata?: any;
}

interface Chat {
  id: string;
  name: string;
  participants: string[];
  last_message?: string;
  last_message_at?: string;
  is_active: boolean;
}

interface RealTimeChatProps {
  chatId?: string;
  recipientId?: string;
  autoFocus?: boolean;
  className?: string;
}

export const RealTimeChat: React.FC<RealTimeChatProps> = ({
  chatId: initialChatId,
  recipientId,
  autoFocus = true,
  className,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState<string | null>(initialChatId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const mobile = useMobileOptimizations();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Créer ou récupérer un chat
  const initializeChat = async () => {
    if (!user) return;

    try {
      let currentChatId = chatId;

      // Si pas de chatId, créer ou trouver un chat existant
      if (!currentChatId && recipientId) {
        // Chercher un chat existant entre les deux utilisateurs
        const { data: existingChat } = await supabase
          .from('chats')
          .select('*')
          .contains('participants', [user.id, recipientId])
          .single();

        if (existingChat) {
          currentChatId = existingChat.id;
        } else {
          // Créer un nouveau chat
          const { data: newChat, error } = await supabase
            .from('chats')
            .insert([
              {
                participants: [user.id, recipientId],
                is_active: true,
                name: `Chat avec ${recipientId}`,
              }
            ])
            .select()
            .single();

          if (error) throw error;
          currentChatId = newChat.id;
        }
      }

      setChatId(currentChatId);
      if (currentChatId) {
        await loadMessages(currentChatId);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser le chat",
        variant: "destructive",
      });
    }
  };

  // Charger les messages
  const loadMessages = async (currentChatId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', currentChatId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      setMessages(data || []);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Envoyer un message
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId || !user) return;

    const messageData = {
      content: newMessage.trim(),
      sender_id: user.id,
      sender_name: profile?.name || 'Utilisateur',
      sender_role: profile?.role || 'client',
      chat_id: chatId,
      message_type: 'text',
    };

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      setNewMessage('');
      
      // Ajouter le message localement pour une réponse immédiate
      setMessages(prev => [...prev, data]);
      scrollToBottom();
      
      // Réponse automatique du bot (simulation)
      if (profile?.role === 'client') {
        setTimeout(() => {
          sendBotResponse(chatId);
        }, 1000 + Math.random() * 2000);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Réponse automatique du bot
  const sendBotResponse = async (currentChatId: string) => {
    const botResponses = [
      "Merci pour votre message ! Un de nos conseillers va vous répondre rapidement.",
      "Je transmets votre demande à notre équipe commerciale.",
      "Pour un devis personnalisé, n'hésitez pas à utiliser notre calculateur de prix.",
      "Nos produits coréens sont disponibles avec livraison au Gabon. Comment puis-je vous aider ?",
    ];

    const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: randomResponse,
            sender_id: 'bot',
            sender_name: 'Assistant COREGAB',
            sender_role: 'bot',
            chat_id: currentChatId,
            message_type: 'text',
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending bot response:', error);
    }
  };

  // Initialiser le chat
  useEffect(() => {
    initializeChat();
  }, [user, recipientId]);

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!chatId) return;

    const subscription = supabase
      .channel(`chat_${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Ne pas ajouter si c'est notre propre message (déjà ajouté localement)
          if (newMessage.sender_id !== user?.id) {
            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
            
            // Notification sonore (si supporté)
            if ('vibrate' in navigator) {
              navigator.vibrate(200);
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId, user?.id]);

  // Auto-focus sur mobile
  useEffect(() => {
    if (autoFocus && mobile.isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, mobile.isMobile]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'bot': return <Bot className="w-3 h-3" />;
      case 'admin': return <Settings className="w-3 h-3" />;
      case 'commercial': return <MessageCircle className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'bot': return 'secondary';
      case 'admin': return 'destructive';
      case 'commercial': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Card className={cn('flex flex-col', className, mobile.isMobile && 'h-[80vh]')}>
      {/* En-tête du chat */}
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                <MessageCircle className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background',
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            )} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Support COREGAB</h3>
            <p className="text-xs text-muted-foreground">
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Zone des messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => {
              const isOwnMessage = message.sender_id === user?.id;
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-2 max-w-[85%]',
                    isOwnMessage ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  )}
                >
                  {!isOwnMessage && (
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {getRoleIcon(message.sender_role)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={cn(
                    'rounded-lg p-3 max-w-full',
                    isOwnMessage 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  )}>
                    {!isOwnMessage && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{message.sender_name}</span>
                        <Badge 
                          variant={getRoleBadgeVariant(message.sender_role)} 
                          className="text-xs"
                        >
                          {message.sender_role}
                        </Badge>
                      </div>
                    )}
                    
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    <div className={cn(
                      'flex items-center gap-1 mt-1',
                      isOwnMessage ? 'justify-end' : 'justify-start'
                    )}>
                      <Clock className="w-3 h-3 opacity-60" />
                      <span className="text-xs opacity-60">
                        {formatMessageTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Indicateur de frappe */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span>
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'tape' : 'tapent'}...
                </span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Zone de saisie */}
      <div className="border-t p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                disabled={isLoading}
                className="flex-1"
              />
              
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading}
            size={mobile.isMobile ? "sm" : "default"}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions rapides */}
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" className="text-xs">
            💰 Demander un devis
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            📦 Suivi de commande
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            ❓ FAQ
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Hook pour gérer les chats
export const useChat = (chatId?: string) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(chatId || null);
  const { user } = useAuth();

  // Charger la liste des chats
  const loadChats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .contains('participants', [user.id])
        .eq('is_active', true)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      setChats(data || []);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  useEffect(() => {
    loadChats();
  }, [user]);

  return {
    chats,
    activeChat,
    setActiveChat,
    loadChats,
  };
};
