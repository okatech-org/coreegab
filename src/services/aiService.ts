// Service de recherche IA pour les produits coréens
export interface AISearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  relevanceScore: number;
  source: string;
  // Add missing properties to match Product interface
  name: string;
  price_krw: number;
  weight: number;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
  relevance: number;
  aiReasoning?: string;
}

export interface AISearchResponse {
  results: AISearchResult[];
  totalResults: number;
  searchTime: number;
  suggestions: string[];
}

class AIService {
  private openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  private geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  // Base de données de produits coréens
  private koreanProducts = [
    {
      id: '1',
      title: 'Hyundai Tucson 2024',
      description: 'SUV compact avec technologie avancée et design moderne',
      category: 'Véhicules',
      price: 25000000,
      currency: 'FCFA',
      imageUrl: '/assets/hyundai-tucson.jpg',
      tags: ['hyundai', 'tucson', 'suv', 'véhicule', 'voiture', 'corée']
    },
    {
      id: '2',
      title: 'Samsung Galaxy S24',
      description: 'Smartphone premium avec IA intégrée et caméra professionnelle',
      category: 'Électronique',
      price: 450000,
      currency: 'FCFA',
      imageUrl: '/assets/samsung-galaxy-s24.jpg',
      tags: ['samsung', 'galaxy', 'smartphone', 'téléphone', 'électronique', 'corée']
    },
    {
      id: '3',
      title: 'LG Réfrigérateur Smart',
      description: 'Réfrigérateur intelligent avec technologie ThinQ et économie d\'énergie',
      category: 'Électroménager',
      price: 850000,
      currency: 'FCFA',
      imageUrl: '/assets/lg-refrigerator.jpg',
      tags: ['lg', 'réfrigérateur', 'électroménager', 'smart', 'corée']
    },
    {
      id: '4',
      title: 'Kia Sportage 2024',
      description: 'SUV familial avec sécurité avancée et confort premium',
      category: 'Véhicules',
      price: 22000000,
      currency: 'FCFA',
      imageUrl: '/assets/kia-sportage.jpg',
      tags: ['kia', 'sportage', 'suv', 'véhicule', 'voiture', 'corée']
    },
    {
      id: '5',
      title: 'MacBook Pro M3',
      description: 'Ordinateur portable professionnel avec puce M3 et écran Retina',
      category: 'Informatique',
      price: 1200000,
      currency: 'FCFA',
      imageUrl: '/assets/macbook-pro-m3.jpg',
      tags: ['macbook', 'pro', 'm3', 'ordinateur', 'apple', 'informatique']
    }
  ];

  // Mots-clés de recherche avec leurs synonymes
  private searchKeywords = {
    'véhicule': ['voiture', 'auto', 'car', 'véhicule', 'automobile', 'hyundai', 'kia'],
    'téléphone': ['smartphone', 'mobile', 'téléphone', 'galaxy', 'samsung', 'iphone'],
    'électroménager': ['réfrigérateur', 'frigo', 'lg', 'électroménager', 'appareil'],
    'informatique': ['ordinateur', 'laptop', 'macbook', 'pc', 'informatique', 'computer']
  };

  async searchProducts(query: string): Promise<AISearchResponse> {
    const startTime = Date.now();
    
    try {
      // Analyse de la requête
      const normalizedQuery = query.toLowerCase().trim();
      const keywords = this.extractKeywords(normalizedQuery);
      
      // Recherche dans la base de données
      const results = this.searchInDatabase(keywords, normalizedQuery);
      
      // Tri par pertinence
      const sortedResults = results.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      const searchTime = Date.now() - startTime;
      
      return {
        results: sortedResults,
        totalResults: sortedResults.length,
        searchTime,
        suggestions: this.getSearchSuggestions(query)
      };
      
    } catch (error) {
      console.error('Erreur lors de la recherche IA:', error);
      return {
        results: [],
        totalResults: 0,
        searchTime: Date.now() - startTime,
        suggestions: []
      };
    }
  }

  private extractKeywords(query: string): string[] {
    const keywords: string[] = [];
    
    // Extraction des mots-clés principaux
    Object.entries(this.searchKeywords).forEach(([category, synonyms]) => {
      synonyms.forEach(synonym => {
        if (query.includes(synonym)) {
          keywords.push(category);
        }
      });
    });
    
    // Extraction des mots individuels
    const words = query.split(/\s+/).filter(word => word.length > 2);
    keywords.push(...words);
    
    return [...new Set(keywords)]; // Suppression des doublons
  }

  private searchInDatabase(keywords: string[], query: string): AISearchResult[] {
    const results: AISearchResult[] = [];
    
    this.koreanProducts.forEach(product => {
      let relevanceScore = 0;
      
      // Calcul du score de pertinence
      keywords.forEach(keyword => {
        if (product.title.toLowerCase().includes(keyword)) {
          relevanceScore += 10;
        }
        if (product.description.toLowerCase().includes(keyword)) {
          relevanceScore += 5;
        }
        if (product.tags.some(tag => tag.includes(keyword))) {
          relevanceScore += 8;
        }
      });
      
      // Bonus pour correspondance exacte
      if (product.title.toLowerCase().includes(query)) {
        relevanceScore += 15;
      }
      
      if (relevanceScore > 0) {
        results.push({
          ...product,
          relevanceScore,
          source: 'Base de données CoreGab',
          // Add missing properties
          name: product.title,
          price_krw: product.price,
          weight: 1.0,
          in_stock: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          relevance: relevanceScore / 100,
          aiReasoning: `Correspondance trouvée pour "${query}" - Score: ${relevanceScore}`
        });
      }
    });
    
    return results;
  }

  // Méthode pour obtenir des suggestions de recherche
  getSearchSuggestions(query: string): string[] {
    const suggestions: string[] = [];
    const normalizedQuery = query.toLowerCase();
    
    // Suggestions basées sur les catégories
    if (normalizedQuery.includes('voiture') || normalizedQuery.includes('véhicule')) {
      suggestions.push('Hyundai Tucson 2024', 'Kia Sportage 2024', 'Véhicules coréens');
    }
    
    if (normalizedQuery.includes('téléphone') || normalizedQuery.includes('smartphone')) {
      suggestions.push('Samsung Galaxy S24', 'Smartphones coréens', 'Électronique');
    }
    
    if (normalizedQuery.includes('réfrigérateur') || normalizedQuery.includes('frigo')) {
      suggestions.push('LG Réfrigérateur Smart', 'Électroménager coréen');
    }
    
    // Suggestions génériques
    suggestions.push('Produits coréens', 'Import Corée du Sud', 'Meilleurs prix');
    
    return suggestions.slice(0, 5); // Limite à 5 suggestions
  }

  // Méthode pour obtenir des informations sur un produit
  getProductInfo(productId: string): AISearchResult | null {
    const product = this.koreanProducts.find(p => p.id === productId);
    if (!product) return null;
    
    return {
      ...product,
      relevanceScore: 100,
      source: 'Base de données CoreGab',
      // Add missing properties
      name: product.title,
      price_krw: product.price,
      weight: 1.0,
      in_stock: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      relevance: 1.0,
      aiReasoning: `Produit sélectionné - ID: ${productId}`
    };
  }
}

export const aiService = {
  async searchWithAI(query: string): Promise<AISearchResponse> {
    const aiServiceInstance = new AIService();
    const response = await aiServiceInstance.searchProducts(query);
    
    return {
      results: response.results,
      totalResults: response.totalResults,
      searchTime: response.searchTime,
      suggestions: response.suggestions
    };
  },

  async searchProducts(query: string): Promise<AISearchResult[]> {
    const aiServiceInstance = new AIService();
    const response = await aiServiceInstance.searchProducts(query);
    return response.results;
  }
};
