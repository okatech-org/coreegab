import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from '@/components/ThemeToggle';
import { mockProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

export default function AISearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const popularSearches = [
    "Samsung Galaxy S24 récent",
    "Réfrigérateur économique LG", 
    "Voiture familiale Hyundai",
    "Pièces détachées originales",
    "Smartphone sous 500,000 FCFA"
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulation de recherche IA
    setTimeout(() => {
      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 1500);
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <div className="flex-1">
          {/* Header */}
          <header className="bg-card shadow-lg sticky top-0 z-40 border-b border-border">
            <div className="container mx-auto px-4 lg:px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <h1 className="text-xl font-bold text-foreground">Recherche IA</h1>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 lg:px-6 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Recherche Intelligente</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Trouvez exactement ce que vous cherchez
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Notre IA comprend vos besoins et vous propose les meilleurs produits coréens
                </p>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Décrivez ce que vous cherchez... (ex: téléphone Samsung récent avec bonne caméra)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                      className="pl-12 pr-24 h-14 text-lg bg-background border-border"
                    />
                    <Button
                      onClick={() => handleSearch(searchQuery)}
                      disabled={!searchQuery.trim() || isSearching}
                      className="absolute right-2 top-2 h-10 bg-primary hover:bg-primary-hover"
                    >
                      {isSearching ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Popular Searches */}
              {!searchResults.length && !isSearching && (
                <Card className="bg-card border border-border mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Essayez ces recherches populaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {popularSearches.map((search, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleQuickSearch(search)}
                          className="h-auto p-4 text-left justify-start bg-background hover:bg-muted border-border"
                        >
                          <div>
                            <div className="font-medium text-foreground">{search}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Search Results */}
              {isSearching && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-3 text-primary">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg font-medium">Recherche en cours...</span>
                  </div>
                  <p className="text-muted-foreground mt-2">Notre IA analyse votre demande</p>
                </div>
              )}

              {searchResults.length > 0 && !isSearching && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">
                      {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && !isSearching && (
                <Card className="bg-card border border-border text-center py-12">
                  <CardContent>
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Aucun résultat trouvé
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Essayez de reformuler votre recherche ou utilisez des termes plus généraux
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                    >
                      Nouvelle recherche
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card className="bg-card border border-border">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">IA Avancée</h3>
                    <p className="text-sm text-muted-foreground">
                      Notre intelligence artificielle comprend vos besoins en langage naturel
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-6 text-center">
                    <Search className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Recherche Contextuelle</h3>
                    <p className="text-sm text-muted-foreground">
                      Trouvez des produits basés sur l'usage, le budget et les préférences
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Recommandations</h3>
                    <p className="text-sm text-muted-foreground">
                      Suggestions personnalisées basées sur vos recherches précédentes
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}