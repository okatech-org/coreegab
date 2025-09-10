import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Zap } from 'lucide-react';
import CommercialChatbot from '@/components/CommercialChatbot';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation d'apparition après un délai
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Bouton de chat organique flottant */}
      {!isOpen && isVisible && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-organic-button chatbot-appear"
          aria-label="Ouvrir le chatbot iAsted"
          title="Discuter avec iAsted, votre conseiller IA"
        >
          <div className="chatbot-icon flex items-center justify-center w-full h-full relative">
            <Bot className="w-8 h-8 relative z-10" />
            
            {/* Particules scintillantes */}
            <div className="absolute top-2 right-2 animate-pulse">
              <Sparkles className="w-3 h-3 text-yellow-300 opacity-80" />
            </div>
            <div className="absolute bottom-2 left-2 animate-pulse delay-500">
              <Zap className="w-2 h-2 text-cyan-300 opacity-60" />
            </div>
          </div>

          {/* Indicateur de présence */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-lg">
            <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
          </div>

          {/* Badge "IA" */}
          <div className="absolute -bottom-1 -left-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
            IA
          </div>
        </button>
      )}

      {/* Notification de bienvenue */}
      {!isOpen && isVisible && (
        <div className="fixed bottom-24 right-8 max-w-xs bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-40 animate-fade-in-up transform transition-all duration-1000 delay-2000 md:block hidden">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-500 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                👋 Salut ! Je suis iAsted
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Votre conseiller IA pour tous vos achats en Corée du Sud
              </p>
            </div>
            <button 
              onClick={() => setIsOpen(true)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label="Ouvrir le chat"
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Interface de chat */}
      <CommercialChatbot 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />

    </>
  );
}