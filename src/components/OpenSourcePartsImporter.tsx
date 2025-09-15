import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Database, 
  Car, 
  Wrench, 
  Search, 
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useOpenSourceParts, useImportOpenSourceParts, useNHTSAData, useSyncNHTSAData } from '@/hooks/useOpenSourceParts';
import { useVehicles } from '@/hooks/useUnifiedProducts';
import { useToast } from '@/hooks/use-toast';

export const OpenSourcePartsImporter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);

  const { toast } = useToast();
  const { vehicles } = useVehicles();
  
  // Hooks pour les données open source
  const { data: openSourceParts = [], isLoading: partsLoading } = useOpenSourceParts({
    category: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined,
    brand: selectedBrand && selectedBrand !== 'all' ? selectedBrand : undefined,
    searchTerm: searchTerm || undefined,
  });

  const { data: categoriesData } = useOpenSourceParts();
  const { data: brandsData } = useOpenSourceParts();
  const { makes, isLoading: nhtsaLoading } = useNHTSAData();
  
  // Extraire les catégories et marques uniques
  const categories = React.useMemo(() => {
    if (!categoriesData || !Array.isArray(categoriesData)) return [];
    return [...new Set(categoriesData.map((item: any) => item.category).filter(Boolean))].filter(cat => cat && cat.trim() !== '');
  }, [categoriesData]);
  
  const brands = React.useMemo(() => {
    if (!brandsData || !Array.isArray(brandsData)) return [];
    return [...new Set(brandsData.map((item: any) => item.brand).filter(Boolean))].filter(brand => brand && brand.trim() !== '');
  }, [brandsData]);

  // Hooks pour les mutations
  const importParts = useImportOpenSourceParts();
  const syncNHTSA = useSyncNHTSAData();

  // Gérer l'import des pièces
  const handleImportParts = async () => {
    if (openSourceParts.length === 0) {
      toast({
        title: "Aucune pièce sélectionnée",
        description: "Veuillez sélectionner des pièces à importer",
        variant: "destructive",
      });
      return;
    }

    const vehicleIds = selectedVehicles.length > 0 
      ? selectedVehicles 
      : vehicles.map(v => v.id);

    await importParts.mutateAsync({
      parts: openSourceParts,
      vehicleIds,
    });
  };

  // Gérer la synchronisation NHTSA
  const handleSyncNHTSA = async () => {
    const hyundaiModels = ['Tucson', 'Elantra', 'Sonata', 'Santa Fe'];
    const kiaModels = ['Sportage', 'Sorento', 'Forte', 'Telluride'];
    const years = [2020, 2021, 2022, 2023, 2024];

    // Synchroniser Hyundai
    await syncNHTSA.mutateAsync({
      make: 'Hyundai',
      models: hyundaiModels,
      years,
    });

    // Synchroniser Kia
    await syncNHTSA.mutateAsync({
      make: 'Kia',
      models: kiaModels,
      years,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Import de Données Open Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="parts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parts" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Pièces Détachées
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Véhicules NHTSA
              </TabsTrigger>
            </TabsList>

            {/* Onglet Pièces */}
            <TabsContent value="parts" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map((category, index) => (
                        category && category.trim() !== '' && (
                          <SelectItem key={`category-${index}`} value={category}>
                            {category}
                          </SelectItem>
                        )
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand">Marque</Label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les marques" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les marques</SelectItem>
                      {brands.map((brand, index) => (
                        brand && brand.trim() !== '' && (
                          <SelectItem key={`brand-${index}`} value={brand}>
                            {brand}
                          </SelectItem>
                        )
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="search">Recherche</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Nom ou référence..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {openSourceParts.length} pièces trouvées
                  </Badge>
                  {partsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>

                <Button
                  onClick={handleImportParts}
                  disabled={importParts.isPending || openSourceParts.length === 0}
                  className="flex items-center gap-2"
                >
                  {importParts.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Importer les Pièces
                </Button>
              </div>

              {/* Liste des pièces */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {openSourceParts.map((part, index) => (
                  <Card key={`part-${index}`} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{part.name || 'Pièce sans nom'}</h4>
                        <Badge variant="outline" className="text-xs">
                          {part.category || 'Non catégorisé'}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {part.partNumber || 'N/A'} - {part.brand || 'Marque inconnue'}
                      </p>
                      
                      {part.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {part.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {part.priceEstimate ? `${part.priceEstimate.toLocaleString()} KRW` : 'Prix sur demande'}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {part.compatibleVehicles?.length || 0} véhicules
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Onglet Véhicules NHTSA */}
            <TabsContent value="vehicles" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    Données officielles du gouvernement américain (NHTSA)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Marques Disponibles
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {makes && Array.isArray(makes) && makes.map((make, index) => (
                          <Badge key={make?.Make_ID || `make-${index}`} variant="outline" className="text-xs">
                            {make?.Make_Name || 'Marque inconnue'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        Action Disponible
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Synchroniser les données de véhicules Hyundai et Kia depuis la base NHTSA
                      </p>
                    </div>
                  </Card>
                </div>

                <Button
                  onClick={handleSyncNHTSA}
                  disabled={syncNHTSA.isPending || nhtsaLoading}
                  className="w-full flex items-center gap-2"
                >
                  {syncNHTSA.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Synchroniser les Données NHTSA
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
