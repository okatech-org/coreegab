// Service de chatbot commercial avec intelligence artificielle
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  productRecommendations?: any[];
}

class ChatbotService {
  private openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  private geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  // Base de connaissances sur les produits coréens
  private productKnowledge = {
    vehicles: {
      hyundai: {
        tucson: {
          price: 25000000,
          currency: 'FCFA',
          features: ['SUV compact', 'Technologie avancée', 'Design moderne', 'Sécurité 5 étoiles'],
          description: 'Le Hyundai Tucson 2024 est un SUV compact qui combine style, performance et technologie. Parfait pour les familles modernes.'
        }
      },
      kia: {
        sportage: {
          price: 22000000,
          currency: 'FCFA',
          features: ['SUV familial', 'Sécurité avancée', 'Confort premium', 'Économie de carburant'],
          description: 'Le Kia Sportage 2024 offre un espace généreux et des technologies de sécurité de pointe.'
        }
      }
    },
    electronics: {
      samsung: {
        galaxy_s24: {
          price: 450000,
          currency: 'FCFA',
          features: ['IA intégrée', 'Caméra professionnelle', 'Écran AMOLED', 'Batterie longue durée'],
          description: 'Le Samsung Galaxy S24 est un smartphone premium avec des capacités d\'IA avancées.'
        }
      }
    },
    appliances: {
      lg: {
        refrigerator: {
          price: 850000,
          currency: 'FCFA',
          features: ['Technologie ThinQ', 'Économie d\'énergie', 'Contrôle intelligent', 'Design moderne'],
          description: 'Le réfrigérateur LG Smart combine innovation et efficacité énergétique.'
        }
      }
    }
  };

  // Réponses prédéfinies pour différents intents
  private responses = {
    greeting: [
      "Bonjour ! Je suis votre assistant IA pour l'import de produits coréens. Comment puis-je vous aider aujourd'hui ?",
      "Salut ! Je suis là pour vous accompagner dans vos achats de produits coréens. Que recherchez-vous ?",
      "Hello ! Bienvenue sur CoreGab. Je peux vous aider à trouver les meilleurs produits coréens. Que souhaitez-vous ?"
    ],
    vehicle_inquiry: [
      "Je peux vous aider avec nos véhicules coréens ! Nous avons des Hyundai et Kia de qualité. Quel type de véhicule vous intéresse ?",
      "Nos véhicules coréens sont réputés pour leur fiabilité. Voulez-vous des informations sur nos modèles disponibles ?",
      "Parfait ! Nous importons des véhicules Hyundai et Kia directement de Corée du Sud. Quel est votre budget approximatif ?"
    ],
    price_inquiry: [
      "Je peux vous donner des prix détaillés pour tous nos produits. Quel produit vous intéresse spécifiquement ?",
      "Nos prix incluent l'import, les taxes et la livraison. Voulez-vous un devis personnalisé ?",
      "Je peux calculer le prix total avec tous les frais. Dites-moi quel produit vous intéresse !"
    ],
    contact: [
      "Vous pouvez nous contacter au +237 6XX XX XX XX ou par email à contact@coregab.com",
      "Notre équipe est disponible du lundi au vendredi de 8h à 18h. Comment préférez-vous être contacté ?",
      "Je peux vous mettre en relation avec notre équipe commerciale. Quel est votre numéro de téléphone ?"
    ],
    default: [
      "Je comprends votre demande. Laissez-moi vous aider avec des informations plus précises.",
      "C'est une excellente question ! Je vais vous donner les meilleures informations disponibles.",
      "Parfait ! Je peux vous accompagner dans cette démarche. Que souhaitez-vous savoir exactement ?"
    ]
  };

  async generateResponse(message: string, conversationHistory: ChatMessage[]): Promise<ChatResponse> {
    try {
      const intent = this.analyzeIntent(message);
      const response = this.generateIntentResponse(intent, message, conversationHistory);
      
      return {
        message: response.message,
        suggestions: response.suggestions,
        productRecommendations: response.productRecommendations
      };
      
    } catch (error) {
      console.error('Erreur lors de la génération de réponse:', error);
      return {
        message: "Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre question ?",
        suggestions: ["Véhicules coréens", "Électronique", "Électroménager", "Contact"]
      };
    }
  }

  private analyzeIntent(message: string): string {
    const normalizedMessage = message.toLowerCase().trim();
    
    // Intent de confirmation
    if (normalizedMessage === 'oui' || normalizedMessage === 'ok' || normalizedMessage === 'd\'accord' || normalizedMessage === 'parfait') {
      return 'confirmation';
    }
    
    // Intent de budget véhicule
    if (normalizedMessage.includes('budget') || normalizedMessage.includes('fcfa') || normalizedMessage.includes('000000')) {
      if (normalizedMessage.includes('véhicule') || normalizedMessage.includes('voiture') || normalizedMessage.includes('hyundai') || normalizedMessage.includes('kia')) {
        return 'vehicle_budget_inquiry';
      }
    }
    
    // Intent de salutation
    if (normalizedMessage.includes('bonjour') || normalizedMessage.includes('salut') || normalizedMessage.includes('hello') || normalizedMessage.includes('bonsoir')) {
      return 'greeting';
    }
    
    // Intent de véhicules
    if (normalizedMessage.includes('véhicule') || normalizedMessage.includes('voiture') || normalizedMessage.includes('hyundai') || normalizedMessage.includes('kia') || normalizedMessage.includes('tucson') || normalizedMessage.includes('sportage')) {
      return 'vehicle_inquiry';
    }
    
    // Intent de prix
    if (normalizedMessage.includes('prix') || normalizedMessage.includes('coût') || normalizedMessage.includes('tarif') || normalizedMessage.includes('combien')) {
      return 'price_inquiry';
    }
    
    // Intent de contact
    if (normalizedMessage.includes('contact') || normalizedMessage.includes('téléphone') || normalizedMessage.includes('email') || normalizedMessage.includes('adresse')) {
      return 'contact';
    }
    
    // Intent d'électronique
    if (normalizedMessage.includes('téléphone') || normalizedMessage.includes('smartphone') || normalizedMessage.includes('samsung') || normalizedMessage.includes('galaxy')) {
      return 'electronics_inquiry';
    }
    
    // Intent d'électroménager
    if (normalizedMessage.includes('réfrigérateur') || normalizedMessage.includes('frigo') || normalizedMessage.includes('lg') || normalizedMessage.includes('électroménager')) {
      return 'appliances_inquiry';
    }
    
    return 'default';
  }

  private generateIntentResponse(intent: string, message: string, conversationHistory: ChatMessage[]): ChatResponse {
    switch (intent) {
      case 'greeting':
        return {
          message: this.getRandomResponse('greeting'),
          suggestions: ["Véhicules coréens", "Électronique", "Électroménager", "Calculer un prix"]
        };
        
      case 'vehicle_inquiry':
        return {
          message: this.getRandomResponse('vehicle_inquiry'),
          suggestions: ["Hyundai Tucson", "Kia Sportage", "Prix des véhicules", "Financement"]
        };
        
      case 'vehicle_budget_inquiry':
        return this.handleVehicleBudgetInquiry(message);
        
      case 'confirmation':
        return this.handleConfirmation(conversationHistory);
        
      case 'price_inquiry':
        return {
          message: this.getRandomResponse('price_inquiry'),
          suggestions: ["Devis personnalisé", "Calcul de prix", "Frais d'import", "Contact commercial"]
        };
        
      case 'contact':
        return {
          message: this.getRandomResponse('contact'),
          suggestions: ["Appeler maintenant", "Envoyer un email", "Prendre rendez-vous", "Localisation"]
        };
        
      case 'electronics_inquiry':
        return {
          message: "Nos produits électroniques coréens sont de qualité premium ! Nous avons des smartphones Samsung Galaxy S24 avec des fonctionnalités d'IA avancées. Voulez-vous plus d'informations ?",
          suggestions: ["Samsung Galaxy S24", "Spécifications techniques", "Prix et disponibilité", "Garantie"]
        };
        
      case 'appliances_inquiry':
        return {
          message: "Nos électroménagers LG sont réputés pour leur innovation et leur efficacité énergétique. Nous avons des réfrigérateurs intelligents avec technologie ThinQ. Intéressé ?",
          suggestions: ["LG Réfrigérateur Smart", "Technologie ThinQ", "Économie d'énergie", "Installation"]
        };
        
      default:
        return {
          message: this.getRandomResponse('default'),
          suggestions: ["Véhicules coréens", "Électronique", "Électroménager", "Contact"]
        };
    }
  }

  private handleVehicleBudgetInquiry(message: string): ChatResponse {
    const budgetMatch = message.match(/(\d+[\s,.]?\d*)\s*(fcfa|000|million|mille)?/i);
    let budget = 0;
    
    if (budgetMatch) {
      budget = parseInt(budgetMatch[1].replace(/[\s,.]/g, ''));
      if (budgetMatch[2] && budgetMatch[2].toLowerCase().includes('million')) {
        budget *= 1000000;
      } else if (budgetMatch[2] && budgetMatch[2].toLowerCase().includes('mille')) {
        budget *= 1000;
      }
    }
    
    const suitableVehicles = [];
    
    if (budget >= 20000000) {
      suitableVehicles.push({
        name: "Hyundai Tucson 2024",
        price: "25,000,000 FCFA",
        features: ["SUV compact", "Technologie avancée", "Design moderne"]
      });
    }
    
    if (budget >= 18000000) {
      suitableVehicles.push({
        name: "Kia Sportage 2024", 
        price: "22,000,000 FCFA",
        features: ["SUV familial", "Sécurité avancée", "Confort premium"]
      });
    }
    
    let responseMessage = "Parfait ! Avec votre budget, voici les véhicules coréens qui correspondent :\n\n";
    
    if (suitableVehicles.length > 0) {
      suitableVehicles.forEach(vehicle => {
        responseMessage += `🚗 **${vehicle.name}** - ${vehicle.price}\n`;
        responseMessage += `   • ${vehicle.features.join('\n   • ')}\n\n`;
      });
      
      responseMessage += "Ces prix incluent l'import, les taxes et la livraison. Voulez-vous un devis détaillé ?";
    } else {
      responseMessage = "Avec ce budget, je peux vous proposer des véhicules d'occasion ou des modèles plus économiques. Voulez-vous que je vous montre nos options ?";
    }
    
    return {
      message: responseMessage,
      suggestions: ["Devis détaillé", "Financement", "Véhicules d'occasion", "Contact commercial"],
      productRecommendations: suitableVehicles
    };
  }

  private handleConfirmation(conversationHistory: ChatMessage[]): ChatResponse {
    // Analyser l'historique pour comprendre le contexte
    const lastMessages = conversationHistory.slice(-3);
    const hasVehicleContext = lastMessages.some(msg => 
      msg.content.toLowerCase().includes('véhicule') || 
      msg.content.toLowerCase().includes('voiture') ||
      msg.content.toLowerCase().includes('hyundai') ||
      msg.content.toLowerCase().includes('kia')
    );
    
    const hasPriceContext = lastMessages.some(msg => 
      msg.content.toLowerCase().includes('prix') || 
      msg.content.toLowerCase().includes('devis') ||
      msg.content.toLowerCase().includes('calcul')
    );
    
    if (hasVehicleContext) {
      return {
        message: "Excellent ! Je vais vous préparer un devis détaillé pour votre véhicule coréen. Un de nos conseillers commerciaux vous contactera dans les plus brefs délais.",
        suggestions: ["Voir d'autres véhicules", "Informations sur le financement", "Processus d'import", "Contact direct"]
      };
    }
    
    if (hasPriceContext) {
      return {
        message: "Parfait ! Je vais calculer le prix total avec tous les frais d'import et de livraison. Vous recevrez un devis personnalisé par email.",
        suggestions: ["Autres produits", "Processus de commande", "Modes de paiement", "Suivi de commande"]
      };
    }
    
    return {
      message: "Parfait ! Comment puis-je vous aider davantage ?",
      suggestions: ["Véhicules coréens", "Électronique", "Électroménager", "Contact"]
    };
  }

  private getRandomResponse(category: keyof typeof this.responses): string {
    const responses = this.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Méthode pour obtenir des suggestions contextuelles
  getContextualSuggestions(lastMessage: string): string[] {
    const normalizedMessage = lastMessage.toLowerCase();
    
    if (normalizedMessage.includes('véhicule') || normalizedMessage.includes('voiture')) {
      return ["Hyundai Tucson", "Kia Sportage", "Prix des véhicules", "Financement"];
    }
    
    if (normalizedMessage.includes('téléphone') || normalizedMessage.includes('smartphone')) {
      return ["Samsung Galaxy S24", "Spécifications", "Prix", "Garantie"];
    }
    
    if (normalizedMessage.includes('réfrigérateur') || normalizedMessage.includes('frigo')) {
      return ["LG Réfrigérateur", "Technologie ThinQ", "Installation", "Prix"];
    }
    
    return ["Véhicules coréens", "Électronique", "Électroménager", "Contact"];
  }
}

export const chatbotService = new ChatbotService();
