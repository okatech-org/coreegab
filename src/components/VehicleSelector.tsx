import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVehicles } from '@/hooks/useVehicles';
import { LoadingSpinner } from './LoadingSpinner';
import { Car } from 'lucide-react';

interface VehicleSelectorProps {
  onVehicleSelect: (vehicleId: string) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ onVehicleSelect }) => {
  const { makes, getModelsByMake, getYearsByMakeAndModel, getVehicleId, isLoading, error } = useVehicles();

  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Dérivations mémorisées pour éviter les boucles
  const models = useMemo(() => getModelsByMake(selectedMake), [getModelsByMake, selectedMake]);
  const years = useMemo(() => getYearsByMakeAndModel(selectedMake, selectedModel), [getYearsByMakeAndModel, selectedMake, selectedModel]);

  // Réinitialiser les champs dépendants proprement
  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setSelectedModel(null);
    setSelectedYear(null);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedYear(null);
  };

  const handleFindParts = () => {
    const vehicleId = getVehicleId(selectedMake, selectedModel, selectedYear);
    if (vehicleId) {
      onVehicleSelect(vehicleId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Car /> Trouver des pièces par véhicule</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-24">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <p className="text-destructive">Erreur de chargement des véhicules.</p>;
  }

  return (
    <Card className="floating-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><Car /> Trouver des pièces par véhicule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Marque */}
          <Select onValueChange={handleMakeChange} value={selectedMake || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Marque" />
            </SelectTrigger>
            <SelectContent>
              {makes.map(make => <SelectItem key={make} value={make}>{make}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Modèle */}
          <Select onValueChange={handleModelChange} value={selectedModel || ''} disabled={!selectedMake}>
            <SelectTrigger>
              <SelectValue placeholder="Modèle" />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Année */}
          <Select onValueChange={(value) => setSelectedYear(parseInt(value))} value={selectedYear?.toString() || ''} disabled={!selectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button 
          className="w-full"
          disabled={!selectedMake || !selectedModel || !selectedYear}
          onClick={handleFindParts}
        >
          Chercher les pièces
        </Button>
      </CardContent>
    </Card>
  );
};
