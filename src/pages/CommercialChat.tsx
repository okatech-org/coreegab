import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, ShoppingCart, Calculator, Package } from 'lucide-react';
import { NewVerticalMenu } from '@/components/NewVerticalMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { mockProducts } from '@/data/mockData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'product' | 'action';
  data?: any;
}

export default function CommercialChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis iAsted, votre assistant commercial COREEGAB. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { icon: ShoppingCart, label: "Voir catalogue", action: "Montrez-moi vos derniers produits disponibles" },
    { icon: Calculator, label: "Calculer prix", action: "Je veux calculer le prix d'un produit" },
    { icon: Package, label: "Suivi commande", action: "Comment suivre ma commande ?" }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        type: botResponse.type,
        data: botResponse.data
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();

    if (input.includes('catalogue') || input.includes('produit')) {
      return {
        text: 'Voici nos derniers produits disponibles :',
        type: 'product' as const,
        data: mockProducts.slice(0, 3)
      };
    }

    if (input.includes('prix') || input.includes('calculer')) {
      return {
        text: 'Pour calculer le prix d\'un produit, j\'ai besoin de quelques informations :\n\n• Le prix en Corée du Sud (KRW)\n• La catégorie du produit\n• Le poids approximatif\n\nVoulez-vous que je vous guide dans le calcul ?',
        type: 'text' as const
      };
    }

    if (input.includes('commande') || input.includes('suivi')) {
      return {
        text: 'Pour suivre votre commande, vous pouvez :\n\n1. Utiliser votre numéro de commande\n2. Consulter votre espace client\n3. Nous contacter directement\n\nAvez-vous votre numéro de commande ?',
        type: 'text' as const
      };
    }

    // Default response
    return {
      text: 'Je comprends votre demande. Laissez-moi vous aider avec cela. Pouvez-vous me donner plus de détails ?',
      type: 'text' as const
    };
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="fixed top-4 left-4 bottom-4 z-50 hidden lg:block">
        <NewVerticalMenu />
      </div>
      <div className="flex-1 flex flex-col lg:pl-[340px]">
        {/* Header */}
        <header className="bg-card shadow-lg border-b border-border">
          <div className="container mx-auto px-4 lg:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">iAsted</h1>
                    <p className="text-xs text-muted-foreground">Assistant Commercial</p>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-2">
                  En ligne
                </Badge>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}>
                    {message.type === 'product' && message.data ? (
                      <div className="space-y-2">
                        <p className="text-sm">{message.text}</p>
                        <div className="grid gap-2">
                          {message.data.map((product: any) => (
                            <div key={product.id} className="bg-background/50 rounded p-2 text-xs">
                              <div className="font-semibold">{product.name}</div>
                              <div className="text-muted-foreground">{product.category}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    )}
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted text-foreground rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2 mb-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.action)}
                  className="h-8 text-xs"
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tapez votre message..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}