import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Send, Bot, User, Loader2, Sparkles, X, Minimize2, Maximize2, MessageCircle, Zap, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { chatbotService, ChatResponse } from '@/services/chatbotService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommercialChatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Salut ! Je suis iAsted, votre conseiller commercial IA chez COREGAB ! 🎌\n\n✨ Je peux vous aider à :\n• 🔍 Trouver des produits coréens (véhicules, électronique, électroménager)\n• 💰 Calculer les prix finaux avec tous les frais\n• 🎯 Vous conseiller sur les meilleures options\n• 📦 Suivre vos commandes\n• 🚚 Informer sur les délais de livraison\n\n💬 Quel produit vous intéresse aujourd'hui ?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll vers le bas lors de nouveaux messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setTypingIndicator(true);

    try {
      console.log('Sending message to AI commercial...', currentMessage);

      // Utilisation directe du service IA local
      const response: ChatResponse = await chatbotService.generateResponse(currentMessage, messages);
      
      // Simulation d'un délai de frappe pour un effet plus naturel
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de contacter iAsted. Veuillez réessayer.",
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "❌ **Erreur de connexion**\n\nImpossible de contacter iAsted. Veuillez réessayer dans quelques instants.\n\n🔄 **Solutions** :\n• Vérifiez votre connexion internet\n• Réessayez dans quelques secondes\n• Contactez le support si le problème persiste\n\n📞 **Support** : +237 6XX XX XX XX",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTypingIndicator(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (!isOpen) return null;

  return (
    <Card className={`fixed bottom-4 right-4 w-96 shadow-2xl border-0 chatbot-container z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[600px]'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 chatbot-header rounded-t-lg relative overflow-hidden">
        {/* Effet de particules en arrière-plan */}
        <div className="absolute inset-0 chatbot-header-particles animate-pulse"></div>
        
        <div className="flex items-center gap-2 relative z-10">
          <Avatar className="w-8 h-8 chatbot-avatar">
            <AvatarFallback className="chatbot-icon bg-transparent">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg flex items-center gap-2 chatbot-icon">
              iAsted
              <div className="w-2 h-2 chatbot-online-status rounded-full animate-pulse"></div>
            </CardTitle>
            <p className="text-xs opacity-90 flex items-center gap-1 chatbot-icon">
              <Zap className="w-3 h-3" />
              Commercial IA • En ligne
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <Badge variant="secondary" className="chatbot-ia-badge">
            <Sparkles className="w-3 h-3 mr-1 chatbot-sparkles" />
            IA
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="chatbot-icon hover:bg-white/20 h-8 w-8 p-0"
            title={isMinimized ? "Agrandir" : "Réduire"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="chatbot-icon hover:bg-white/20 h-8 w-8 p-0"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          {/* Zone de messages */}
          <ScrollArea 
            className="flex-1 p-4" 
            ref={scrollAreaRef}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 chatbot-avatar">
                      <AvatarFallback className="chatbot-icon bg-transparent">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'chatbot-user-message'
                        : 'chatbot-ai-message'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {formatMessage(message.content)}
                    </div>
                    <div className={`text-xs mt-2 flex items-center gap-1 ${
                      message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {message.role === 'assistant' && <Sparkles className="w-3 h-3 chatbot-sparkles" />}
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 chatbot-user-avatar">
                      <AvatarFallback className="chatbot-icon bg-transparent">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Indicateur de frappe */}
              {typingIndicator && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 chatbot-avatar">
                    <AvatarFallback className="chatbot-icon bg-transparent">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="chatbot-typing-indicator rounded-xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 chatbot-typing-dots rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 chatbot-typing-dots rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 chatbot-typing-dots rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-xs chatbot-typing-text ml-2">iAsted écrit...</span>
                    </div>
                  </div>
                </div>
              )}
            
            </div>
          </ScrollArea>

          {/* Zone de saisie améliorée */}
          <div className="chatbot-input-area p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="💬 Parlez-moi de vos besoins..."
                disabled={isLoading}
                className="flex-1 chatbot-input transition-colors"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="px-4 chatbot-send-button border-0 shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* Suggestions rapides */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("Je cherche un smartphone Samsung")}
                className="text-xs h-7 px-2 chatbot-suggestion-button"
              >
                📱 Smartphones
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("Calculer le prix d'un produit")}
                className="text-xs h-7 px-2 chatbot-suggestion-button"
              >
                💰 Calcul prix
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("Délais de livraison")}
                className="text-xs h-7 px-2 chatbot-suggestion-button"
              >
                🚚 Livraison
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-500" />
              iAsted est là pour vous aider 24/7
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}