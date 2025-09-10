import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Données produits de démonstration (en production, ces données viendraient de la base de données)
const mockProducts = [
  {
    id: '1',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'smartphones',
    price_krw: 1800000,
    weight: 0.5,
    description: 'Smartphone haut de gamme avec caméra 200MP',
    in_stock: true
  },
  {
    id: '11',
    name: 'Hyundai Tucson 2024',
    category: 'vehicles',
    price_krw: 35000000,
    weight: 1500,
    description: 'SUV hybride 7 places',
    in_stock: true
  },
  {
    id: '16',
    name: 'LG Réfrigérateur Inox',
    category: 'appliances',
    price_krw: 1500000,
    weight: 120,
    description: 'Réfrigérateur double porte 500L',
    in_stock: true
  }
];

// Configuration des prix
const priceSettings = {
  exchange_rate_krw_xaf: 0.65,
  transport_base: 50000,
  transport_per_kg: 1000,
  margin_rate: 0.35
};

// Fonction pour calculer le prix final
function calculateFinalPrice(product: any) {
  const supplierPrice = product.price_krw * priceSettings.exchange_rate_krw_xaf;
  const transportCost = priceSettings.transport_base + (product.weight * priceSettings.transport_per_kg);
  const customsCost = supplierPrice * 0.10; // 10% douane
  const margin = (supplierPrice + transportCost + customsCost) * priceSettings.margin_rate;
  
  return {
    supplierPrice: Math.round(supplierPrice),
    transportCost: Math.round(transportCost),
    customsCost: Math.round(customsCost),
    margin: Math.round(margin),
    total: Math.round(supplierPrice + transportCost + customsCost + margin)
  };
}

// Fonction pour rechercher des produits
function searchProducts(query: string) {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery)
  );
}

// Instructions système pour le chatbot
const systemPrompt = `Tu es iAsted, un agent commercial IA spécialisé dans l'import de produits coréens vers le Gabon via COREGAB.

CONTEXTE :
- Tu travailles pour COREGAB, spécialiste de l'import de produits coréens
- Tu peux importer : véhicules Hyundai/Kia, électronique Samsung/LG, électroménager
- Tu calcules automatiquement les prix finaux avec tous les frais
- Tu es disponible 24/7 pour aider les clients

PRODUITS DISPONIBLES :
${mockProducts.map(p => `- ${p.name} (${p.category}): ${p.price_krw} KRW, ${p.weight}kg - ${p.description}`).join('\n')}

CALCULS DE PRIX :
- Taux de change : 1 KRW = 0.65 FCFA
- Transport de base : 50,000 FCFA + 1,000 FCFA/kg
- Frais de douane : 10% du prix fournisseur
- Marge COREGAB : 35% sur le coût total

INSTRUCTIONS :
1. Sois chaleureux, professionnel et proactif
2. Pose des questions pour comprendre les besoins précis
3. Utilise les fonctions search_products et calculate_price pour donner des informations exactes
4. Propose toujours plusieurs options si disponibles
5. Explique clairement la composition du prix final
6. Recommande des produits similaires ou complémentaires
7. Informe sur les délais de livraison (7-14 jours généralement)
8. Mentionne les garanties et le service après-vente

STYLE :
- Utilise "vous" (vouvoiement)
- Sois enthousiaste mais pas insistant
- Donne des informations concrètes et détaillées
- Utilise des emojis avec parcimonie pour rendre l'échange agréable
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversation_history = [] } = await req.json();

    console.log('Received message:', message);

    // Outils disponibles pour le chatbot
    const tools = [
      {
        type: "function",
        name: "search_products",
        description: "Recherche des produits dans le catalogue COREGAB selon les critères du client",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Mots-clés pour la recherche (nom, catégorie, marque, etc.)"
            }
          },
          required: ["query"]
        }
      },
      {
        type: "function",
        name: "calculate_price",
        description: "Calcule le prix final d'un produit avec tous les frais et la marge",
        parameters: {
          type: "object",
          properties: {
            product_id: {
              type: "string",
              description: "ID du produit pour lequel calculer le prix"
            }
          },
          required: ["product_id"]
        }
      }
    ];

    // Construire l'historique de la conversation
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation_history,
      { role: 'user', content: message }
    ];

    console.log('Calling OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        tools: tools,
        tool_choice: 'auto',
        temperature: 0.7,
        max_completion_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data, null, 2));

    let assistantMessage = data.choices[0].message;
    let toolResults = [];

    // Traiter les appels d'outils si présents
    if (assistantMessage.tool_calls) {
      console.log('Processing tool calls:', assistantMessage.tool_calls);
      
      for (const toolCall of assistantMessage.tool_calls) {
        const { name, arguments: args } = toolCall.function;
        const parsedArgs = JSON.parse(args);
        
        let result;
        
        if (name === 'search_products') {
          const products = searchProducts(parsedArgs.query);
          result = {
            found: products.length,
            products: products.map(p => ({
              id: p.id,
              name: p.name,
              category: p.category,
              price_krw: p.price_krw,
              weight: p.weight,
              description: p.description,
              in_stock: p.in_stock
            }))
          };
        } else if (name === 'calculate_price') {
          const product = mockProducts.find(p => p.id === parsedArgs.product_id);
          if (product) {
            const pricing = calculateFinalPrice(product);
            result = {
              product: product.name,
              breakdown: {
                prix_fournisseur_krw: product.price_krw,
                prix_fournisseur_fcfa: pricing.supplierPrice,
                transport: pricing.transportCost,
                douane: pricing.customsCost,
                marge_coregab: pricing.margin,
                prix_final: pricing.total
              },
              details: {
                taux_change: priceSettings.exchange_rate_krw_xaf,
                poids: product.weight,
                transport_base: priceSettings.transport_base,
                transport_par_kg: priceSettings.transport_per_kg,
                taux_douane: "10%",
                taux_marge: "35%"
              }
            };
          } else {
            result = { error: "Produit non trouvé" };
          }
        }
        
        toolResults.push({
          tool_call_id: toolCall.id,
          result: JSON.stringify(result)
        });
      }

      // Faire un second appel à OpenAI avec les résultats des outils
      const followUpMessages = [
        ...messages,
        assistantMessage,
        ...toolResults.map(tr => ({
          role: 'tool',
          tool_call_id: tr.tool_call_id,
          content: tr.result
        }))
      ];

      const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: followUpMessages,
          temperature: 0.7,
          max_completion_tokens: 1000
        }),
      });

      const followUpData = await followUpResponse.json();
      assistantMessage = followUpData.choices[0].message;
    }

    return new Response(JSON.stringify({
      message: assistantMessage.content,
      tool_calls: assistantMessage.tool_calls || [],
      tool_results: toolResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-commercial function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "Désolé, je rencontre une difficulté technique. Pouvez-vous reformuler votre demande ?"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});