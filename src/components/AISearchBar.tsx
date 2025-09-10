import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Sparkles, Mic, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AISearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const aiSuggestions = [
  { title: 'Samsung Galaxy S24 récent', description: 'Smartphone haut de gamme avec caméra avancée' },
  { title: 'Réfrigérateur économique LG', description: 'Électroménager grande capacité' },
  { title: 'Voiture familiale Hyundai', description: '7 places, récente, bon état' },
  { title: 'Ordinateur portable gaming', description: 'Performance élevée pour jeux' },
  { title: 'Télévision 4K 55 pouces', description: 'Écran haute définition Samsung ou LG' }
];

export default function AISearchBar({ onSearch, placeholder }: AISearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof aiSuggestions>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchMode, setSearchMode] = useState<'text' | 'voice' | 'image'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleAISearch = async (searchText: string) => {
    if (!searchText.trim()) return;
    
    setIsSearching(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Generate AI suggestions based on query
      const filteredSuggestions = aiSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(searchText.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(searchText.toLowerCase())
      );
      
      setSuggestions(filteredSuggestions.slice(0, 3));
      setShowSuggestions(filteredSuggestions.length > 0);
      setIsSearching(false);
      
      onSearch(searchText);
      
      toast({
        title: "Recherche IA",
        description: `Analyse terminée pour "${searchText}"`,
      });
    }, 800);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.length > 2) {
      handleAISearch(newQuery);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleVoiceSearch = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulate voice recording
      toast({
        title: "Enregistrement vocal",
        description: "Parlez maintenant...",
      });
      
      setTimeout(() => {
        setIsRecording(false);
        const voiceQuery = "Samsung Galaxy S24 pas cher";
        setQuery(voiceQuery);
        handleAISearch(voiceQuery);
        toast({
          title: "Recherche vocale",
          description: `Recherche pour: "${voiceQuery}"`,
        });
      }, 3000);
    }
  };

  const handleImageSearch = () => {
    toast({
      title: "Recherche par image",
      description: "Fonctionnalité bientôt disponible",
    });
  };

  const selectSuggestion = (suggestion: typeof aiSuggestions[0]) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    onSearch(suggestion.title);
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Mode selector */}
      <div className="flex gap-2 mb-3">
        <Button
          variant={searchMode === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSearchMode('text')}
        >
          <Search className="w-4 h-4 mr-1" />
          Texte
        </Button>
        <Button
          variant={searchMode === 'voice' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setSearchMode('voice');
            handleVoiceSearch();
          }}
          disabled={isRecording}
        >
          <Mic className={`w-4 h-4 mr-1 ${isRecording ? 'animate-pulse' : ''}`} />
          {isRecording ? 'Écoute...' : 'Voix'}
        </Button>
        <Button
          variant={searchMode === 'image' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setSearchMode('image');
            handleImageSearch();
          }}
        >
          <Camera className="w-4 h-4 mr-1" />
          Image
        </Button>
      </div>

      {/* Search input */}
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={placeholder || "🤖 Recherche IA : 'téléphone Samsung récent' ou 'voiture familiale économique'"}
          className="w-full pl-12 pr-16 py-3 rounded-full border-2"
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Button
          onClick={() => handleAISearch(query)}
          disabled={isSearching || !query.trim()}
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
        >
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* AI Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Suggestions intelligentes
            </p>
            <div className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSuggestion(suggestion)}
                  className="p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <p className="font-medium text-sm">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick suggestions when empty */}
      {query === '' && (
        <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Essayez ces recherches populaires
          </p>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.slice(0, 3).map((suggestion, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => {
                  setQuery(suggestion.title);
                  handleAISearch(suggestion.title);
                }}
              >
                {suggestion.title}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}