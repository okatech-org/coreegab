import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { NewVerticalMenu } from '@/components/NewVerticalMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AISearchResults } from '@/components/AISearchResults';
import { aiService, AISearchResponse } from '@/services/aiService';

export default function AISearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState<AISearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await aiService.searchWithAI(query);
      setSearchResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setSearchResponse(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRetry = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="fixed top-4 left-4 bottom-4 z-50 hidden lg:block">
        <NewVerticalMenu />
      </div>
      <div className="flex-1 lg:pl-[340px]">
        {/* Header */}
        <header className="bg-card shadow-lg sticky top-0 z-40 border-b border-border">
          <div className="container mx-auto px-4 lg:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                  <h1 className="text-xl font-bold text-foreground">Recherche IA</h1>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 lg:px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-bold text-foreground">Recherche Intelligente</h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trouvez exactement ce que vous cherchez grâce à notre intelligence artificielle avancée
              </p>
            </div>

            {/* Search Bar */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Décrivez ce que vous cherchez..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-lg"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    />
                  </div>
                  <Button 
                    onClick={() => handleSearch(searchQuery)}
                    disabled={isSearching}
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSearching ? (
                      <Zap className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Rechercher
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Search Suggestions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recherches populaires</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Smartphones Samsung',
                  'Cosmétiques coréens',
                  'Vêtements K-pop',
                  'Électronique gaming',
                  'Produits de beauté'
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSearch(suggestion)}
                    className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Search Results */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Résultats de recherche
                  {searchQuery && (
                    <span className="text-muted-foreground ml-2">
                      pour "{searchQuery}"
                    </span>
                  )}
                </h3>
              </div>

              <AISearchResults
                searchResponse={searchResponse}
                isSearching={isSearching}
                error={error}
                onRetry={handleRetry}
              />
            </div>

            {/* AI Features */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Fonctionnalités IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Recherche Sémantique</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprend le sens de vos recherches, pas seulement les mots-clés
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Recommandations</h4>
                    <p className="text-sm text-muted-foreground">
                      Découvrez des produits similaires et des alternatives
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Recherche Rapide</h4>
                    <p className="text-sm text-muted-foreground">
                      Résultats instantanés grâce à notre technologie avancée
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}