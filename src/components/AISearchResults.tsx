import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { AISearchResult, AISearchResponse } from '@/services/aiService';
import ProductCard from '@/components/ProductCard';

interface AISearchResultsProps {
  searchResponse: AISearchResponse | null;
  isSearching: boolean;
  error: string | null;
  onRetry: () => void;
}

export const AISearchResults: React.FC<AISearchResultsProps> = ({
  searchResponse,
  isSearching,
  error,
  onRetry
}) => {
  if (isSearching) {
    return (
      <Card className="p-12 text-center">
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            iAsted analyse votre demande...
          </h3>
          <p className="text-muted-foreground">
            Notre IA intelligente recherche les meilleurs produits pour vous
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardContent>
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
            Erreur
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error}
          </p>
          <Button 
            onClick={onRetry}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
          >
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!searchResponse) {
    return (
      <Card className="p-12 text-center">
        <CardContent>
          <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Recherche IA Prête
          </h3>
          <p className="text-muted-foreground">
            Décrivez ce que vous cherchez et notre IA vous trouvera les meilleurs produits
          </p>
        </CardContent>
      </Card>
    );
  }

  const { results, suggestions, totalResults, searchTime } = searchResponse;

  return (
    <div className="space-y-6">
      {/* Statistiques de recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">
                  {totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {searchTime}ms
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              <Sparkles className="w-3 h-3" />
              IA
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Résultats de recherche */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product) => (
            <Card key={product.id} className="relative overflow-hidden">
              <div className="absolute top-2 right-2 z-10">
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                >
                  {Math.round(product.relevance * 100)}% match
                </Badge>
              </div>
              <ProductCard product={product as any} />
              {product.aiReasoning && (
                <CardContent className="p-3 pt-0">
                  <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    <strong>IA:</strong> {product.aiReasoning}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <CardContent>
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche ou utilisez des mots-clés différents
            </p>
          </CardContent>
        </Card>
      )}

      {/* Suggestions IA */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Suggestions IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
