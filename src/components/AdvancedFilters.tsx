import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Filter, 
  X, 
  Search, 
  DollarSign, 
  Package, 
  Star,
  RotateCcw
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  priceRange: [number, number];
  inStock: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  categories: string[];
  brands: string[];
  maxPrice: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  categories,
  brands,
  maxPrice,
  isOpen,
  onToggle,
}) => {
  const { formatPrice } = useCurrency();

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = [
    filters.search,
    filters.category !== 'all',
    filters.brand !== 'all',
    filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice,
    filters.inStock,
  ].filter(Boolean).length;

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        className="relative"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtres
        {activeFiltersCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres Avancés
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Recherche */}
        <div className="space-y-2">
          <Label htmlFor="search">Recherche</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nom, référence, marque..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Catégorie */}
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Marque */}
        <div className="space-y-2">
          <Label>Marque</Label>
          <Select value={filters.brand} onValueChange={(value) => updateFilter('brand', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les marques" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les marques</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Prix */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Prix (KRW)
          </Label>
          <div className="space-y-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              max={maxPrice}
              min={0}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatPrice(filters.priceRange[0], 'KRW')}</span>
              <span>{formatPrice(filters.priceRange[1], 'KRW')}</span>
            </div>
          </div>
        </div>

        {/* Stock */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={(checked) => updateFilter('inStock', checked)}
          />
          <Label htmlFor="inStock" className="text-sm">
            En stock uniquement
          </Label>
        </div>

        {/* Tri */}
        <div className="space-y-2">
          <Label>Trier par</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Critère" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="price">Prix</SelectItem>
                <SelectItem value="brand">Marque</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value as 'asc' | 'desc')}>
              <SelectTrigger>
                <SelectValue placeholder="Ordre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Croissant</SelectItem>
                <SelectItem value="desc">Décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtres actifs */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Filtres actifs</Label>
            <div className="flex flex-wrap gap-1">
              {filters.search && (
                <Badge variant="secondary" className="text-xs">
                  Recherche: {filters.search}
                </Badge>
              )}
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Catégorie: {filters.category}
                </Badge>
              )}
              {filters.brand !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Marque: {filters.brand}
                </Badge>
              )}
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) && (
                <Badge variant="secondary" className="text-xs">
                  Prix: {formatPrice(filters.priceRange[0], 'KRW')} - {formatPrice(filters.priceRange[1], 'KRW')}
                </Badge>
              )}
              {filters.inStock && (
                <Badge variant="secondary" className="text-xs">
                  En stock
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
