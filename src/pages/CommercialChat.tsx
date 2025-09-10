import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, ShoppingCart, Calculator, Package } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from '@/components/ThemeToggle';
import { mockProducts } from '@/data/mockData';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  products?: any[];
}

export default function CommercialChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Bonjour ! Je suis iAsted, votre assistant commercial intelligent. Je peux vous aider à trouver des produits, calculer des prix, et répondre à toutes vos questions sur nos importations de Corée. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
      suggestions: [
        "Rechercher un produit",
        "Calculer un prix",
        "Voir les nouveautés",
        "Obtenir des informations de livraison"
      ]
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

  const simulateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('prix') || lowerMessage.includes('coût') || lowerMessage.includes('tarif')) {
      return "Pour calculer le prix exact de votre produit, j'ai besoin de quelques informations : le prix en KRW en Corée, la catégorie du produit, et son poids approximatif. Avec ces données, je peux vous donner un devis précis incluant le transport, les douanes et notre marge.";
    }
    
    if (lowerMessage.includes('samsung') || lowerMessage.includes('téléphone') || lowerMessage.includes('smartphone')) {
      return "Excellente question ! Nous avons plusieurs modèles Samsung disponibles, notamment le Galaxy S24 qui est très populaire. Le prix final dépend du modèle spécifique. Voulez-vous que je vous montre nos smartphones Samsung disponibles ?";
    }
    
    if (lowerMessage.includes('voiture') || lowerMessage.includes('véhicule') || lowerMessage.includes('hyundai') || lowerMessage.includes('kia')) {
      return "Nous importons des véhicules Hyundai et KIA directement de Corée. Les modèles populaires incluent le Tucson, le Sportage et l'Elantra. Le processus d'importation prend généralement 6-8 semaines. Quel type de véhicule vous intéresse ?";
    }
    
    if (lowerMessage.includes('livraison') || lowerMessage.includes('délai') || lowerMessage.includes('transport')) {
      return "Les délais de livraison varient selon le produit : Électronique (2-3 semaines), Électroménager (3-4 semaines), Véhicules (6-8 semaines), Pièces détachées (2-3 semaines). Le transport inclut l'expédition maritime et la livraison jusqu'à Libreville.";
    }
    
    if (lowerMessage.includes('stock') || lowerMessage.includes('disponible') || lowerMessage.includes('disponibilité')) {
      return "Nos stocks sont mis à jour en temps réel. Les produits marqués 'En stock' sont disponibles immédiatement à Libreville. Pour les autres, nous pouvons les commander directement en Corée avec un délai de livraison estimé.";
    }
    
    return "Je comprends votre question. Pour vous donner la meilleure réponse possible, pourriez-vous me donner plus de détails ? Je peux vous aider avec la recherche de produits, les calculs de prix, les informations de livraison, et bien plus encore.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseContent = simulateResponse(inputMessage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        suggestions: [
          "En savoir plus",
          "Voir les produits similaires",
          "Calculer le prix",
          "Autre question"
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const quickActions = [
    { icon: ShoppingCart, label: "Voir catalogue", action: "Montrez-moi vos derniers produits disponibles" },
    { icon: Calculator, label: "Calculer prix", action: "Je veux calculer le prix d'un produit" },
    { icon: Package, label: "Suivi commande", action: "Comment suivre ma commande ?" }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-card shadow-lg border-b border-border">
            <div className="container mx-auto px-4 lg:px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-foreground">iAsted</h1>
                      <p className="text-xs text-muted-foreground">Assistant Commercial IA</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
                      En ligne
                    </Badge>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col max-h-[calc(100vh-80px)]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${message.type === 'user' ? 'order-2' : ''}`}>
                      <Card className={`${message.type === 'user' 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-card border-border'
                      }`}>
                        <CardContent className="p-4">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          {message.suggestions && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs h-7"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      <p className="text-xs text-muted-foreground mt-1 px-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <Card className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-border bg-card">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-2 mb-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(action.action)}
                      className="flex items-center gap-2 text-xs"
                    >
                      <action.icon className="w-3 h-3" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-background border-border"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-primary hover:bg-primary-hover"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}