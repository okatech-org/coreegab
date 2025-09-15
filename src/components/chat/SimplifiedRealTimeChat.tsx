import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, Users, Circle } from 'lucide-react';
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

interface Chat {
  id: string;
  name: string;
  participants: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const SimplifiedRealTimeChat: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const { user } = useAuth();

  // Mock data for demonstration
  useEffect(() => {
    if (!user) return;

    // Mock chats
    const mockChats: Chat[] = [
      {
        id: '1',
        name: 'Support Client',
        participants: [user.id, 'admin-1'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Commercial - Produits',
        participants: [user.id, 'commercial-1'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Mock messages
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Bonjour ! Comment puis-je vous aider ?',
        sender_id: 'admin-1',
        sender_name: 'Support',
        sender_role: 'admin',
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        chat_id: '1',
        is_read: true
      },
      {
        id: '2',
        content: 'J\'aimerais avoir des informations sur les produits Samsung',
        sender_id: user.id,
        sender_name: user.email || 'Vous',
        sender_role: user.role as 'client' | 'commercial' | 'admin',
        created_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        chat_id: '1',
        is_read: true
      }
    ];

    setChats(mockChats);
    setMessages(mockMessages);
    setSelectedChat('1');
  }, [user]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: user.id,
      sender_name: user.email || 'Vous',
      sender_role: user.role as 'client' | 'commercial' | 'admin',
      created_at: new Date().toISOString(),
      chat_id: selectedChat,
      is_read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const filteredMessages = messages.filter(m => m.chat_id === selectedChat);
  const selectedChatData = chats.find(c => c.id === selectedChat);

  if (!user) return null;

  return (
    <div className="flex h-96 border rounded-lg overflow-hidden">
      {/* Liste des chats */}
      <div className="w-1/3 border-r bg-muted/30">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Conversations
            </h3>
            <div className="flex items-center gap-1">
              <Circle className={`w-2 h-2 ${isOnline ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`} />
              <span className="text-xs text-muted-foreground">
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </span>
            </div>
          </div>
        </div>

        <ScrollArea className="h-80">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-3 cursor-pointer hover:bg-muted/50 border-b transition-colors ${
                selectedChat === chat.id ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {chat.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{chat.name}</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {chat.participants.length} participant{chat.participants.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                {chat.is_active && (
                  <Badge variant="secondary" className="text-xs">
                    Actif
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* En-tête du chat */}
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {selectedChatData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-sm">{selectedChatData.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedChatData.participants.length} participant{selectedChatData.participants.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {message.sender_name}
                        </span>
                        <Badge variant="outline" className="text-xs h-4">
                          {message.sender_role}
                        </Badge>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Zone de saisie */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                Sélectionnez une conversation pour commencer
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};