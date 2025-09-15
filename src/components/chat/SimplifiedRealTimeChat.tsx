import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'client' | 'commercial' | 'admin';
  created_at: string;
  chat_id: string;
  is_read: boolean;
}

export const SimplifiedRealTimeChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user, profile } = useAuth();

  // Simulation de messages pour la démo
  React.useEffect(() => {
    if (user && profile) {
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
          sender_id: 'support',
          sender_name: 'Support COREEGAB',
          sender_role: 'commercial',
          created_at: new Date().toISOString(),
          chat_id: 'demo-chat',
          is_read: true
        }
      ];
      setMessages(mockMessages);
    }
  }, [user, profile]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user || !profile) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: user.id,
      sender_name: profile.name || 'Utilisateur',
      sender_role: profile.role as any,
      created_at: new Date().toISOString(),
      chat_id: 'demo-chat',
      is_read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulation d'une réponse automatique
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Merci pour votre message ! Notre équipe commerciale vous répondra sous peu.',
        sender_id: 'support',
        sender_name: 'Support COREEGAB',
        sender_role: 'commercial',
        created_at: new Date().toISOString(),
        chat_id: 'demo-chat',
        is_read: false
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chat en temps réel
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender_id === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <div className="text-xs opacity-70 mb-1">
                  {message.sender_name}
                </div>
                <div>{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};