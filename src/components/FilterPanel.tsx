import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  onFiltersChange?: (filters: any) => void;
}

export default function FilterPanel({ onFiltersChange }: FilterPanelProps) {
  const [priceRange, setPriceRange] = useState([50000, 5000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availability, setAvailability] = useState('all');

  const brands = [
    { id: 'samsung', name: 'Samsung', count: 45 },
    { id: 'lg', name: 'LG', count: 32 },
    { id: 'hyundai', name: 'Hyundai', count: 18 },
    { id: 'kia', name: 'KIA', count: 15 },
    { id: 'apple', name: 'Apple', count: 12 },
    { id: 'sony', name: 'Sony', count: 28 }
  ];

  const categories = [
    { id: 'smartphones', name: 'Smartphones', count: 5 },
    { id: 'electronics', name: 'Électronique', count: 5 },
    { id: 'appliances', name: 'Électroménager', count: 5 },
    { id: 'vehicles', name: 'Véhicules', count: 5 },
    { id: 'parts', name: 'Pièces détachées', count: 5 }
  ];

  const handleBrandChange = (brandId: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brandId]);
    } else {
      setSelectedBrands(selectedBrands.filter(id => id !== brandId));
    }
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const resetFilters = () => {
    setPriceRange([50000, 5000000]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setAvailability('all');
  };

  const activeFiltersCount = selectedBrands.length + selectedCategories.length + (availability !== 'all' ? 1 : 0);

  return (
    <Card className="sticky top-4 bg-card border border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </CardTitle>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 px-2"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Prix */}
        <div>
          <h4 className="font-medium mb-3">Prix (FCFA)</h4>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={10000000}
            min={10000}
            step={50000}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{priceRange[0].toLocaleString()}</span>
            <span>{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        {/* Disponibilité */}
        <div>
          <h4 className="font-medium mb-3">Disponibilité</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all"
                checked={availability === 'all'}
                onCheckedChange={() => setAvailability('all')}
              />
              <label htmlFor="all" className="text-sm">Tous les produits</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stock"
                checked={availability === 'stock'}
                onCheckedChange={() => setAvailability('stock')}
              />
              <label htmlFor="stock" className="text-sm">En stock uniquement</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="libreville"
                checked={availability === 'libreville'}
                onCheckedChange={() => setAvailability('libreville')}
              />
              <label htmlFor="libreville" className="text-sm">Disponible à Libreville</label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Marques */}
        <div>
          <h4 className="font-medium mb-3">Marques</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={brand.id}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                  />
                  <label htmlFor={brand.id} className="text-sm">
                    {brand.name}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">
                  {brand.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Catégories */}
        <div>
          <h4 className="font-medium mb-3">Catégories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <label htmlFor={category.id} className="text-sm">
                    {category.name}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}