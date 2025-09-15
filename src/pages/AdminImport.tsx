import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Zap, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function AdminImport() {
  const [importMethod, setImportMethod] = useState('manual');
  const [file, setFile] = useState<File | null>(null);
  const [product, setProduct] = useState({
    name: '',
    name_kr: '',
    category: '',
    brand: '',
    price_krw: '',
    stock_quantity: '',
    location: 'Libreville',
    description: ''
  });
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      toast({
        title: "Fichier chargé",
        description: `${uploadedFile.name} prêt à être traité`,
      });
    }
  };

  const handleManualSubmit = () => {
    if (!product.name || !product.price_krw) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Produit ajouté",
      description: "Le produit a été ajouté avec succès au catalogue",
    });

    setProduct({
      name: '',
      name_kr: '',
      category: '',
      brand: '',
      price_krw: '',
      stock_quantity: '',
      location: 'Libreville',
      description: ''
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 w-full">
      <div className="fixed top-4 left-4 bottom-4 z-50 hidden lg:block">
      </div>
        <div className="flex-1 lg:pl-[340px]">
          <header className="h-12 flex items-center border-b bg-background">
            <h1 className="ml-4 text-lg font-semibold">Import de Produits</h1>
          </header>
          <main className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Import de Produits</h2>
                <p className="text-muted-foreground">
                  Ajoutez des produits à votre catalogue via différentes méthodes
                </p>
              </div>

            <Tabs value={importMethod} onValueChange={setImportMethod} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Manuel
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  API Fournisseur
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Fichier CSV/Excel
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual">
                <Card>
                  <CardHeader>
                    <CardTitle>Ajouter un Produit Manuellement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom du Produit *</Label>
                        <Input
                          id="name"
                          value={product.name}
                          onChange={(e) => setProduct({...product, name: e.target.value})}
                          placeholder="Ex: Samsung Galaxy S24"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name_kr">Nom Coréen</Label>
                        <Input
                          id="name_kr"
                          value={product.name_kr}
                          onChange={(e) => setProduct({...product, name_kr: e.target.value})}
                          placeholder="Ex: 삼성 갤럭시 S24"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie *</Label>
                        <Select
                          value={product.category}
                          onValueChange={(value) => setProduct({...product, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="smartphones">Smartphones</SelectItem>
                            <SelectItem value="electronics">Électronique</SelectItem>
                            <SelectItem value="appliances">Électroménager</SelectItem>
                            <SelectItem value="vehicles">Véhicules</SelectItem>
                            <SelectItem value="parts">Pièces détachées</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="brand">Marque</Label>
                        <Input
                          id="brand"
                          value={product.brand}
                          onChange={(e) => setProduct({...product, brand: e.target.value})}
                          placeholder="Ex: Samsung"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price_krw">Prix en KRW *</Label>
                        <Input
                          id="price_krw"
                          type="number"
                          value={product.price_krw}
                          onChange={(e) => setProduct({...product, price_krw: e.target.value})}
                          placeholder="Ex: 1500000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stock">Quantité en Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={product.stock_quantity}
                          onChange={(e) => setProduct({...product, stock_quantity: e.target.value})}
                          placeholder="Ex: 10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={product.description}
                        onChange={(e) => setProduct({...product, description: e.target.value})}
                        placeholder="Description détaillée du produit..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Images du Produit</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">
                          Cliquez pour télécharger ou glissez-déposez
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG jusqu'à 10MB
                        </p>
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>

                    <Button onClick={handleManualSubmit} className="w-full">
                      Ajouter le Produit
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="api">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration API Fournisseur</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Fournisseur</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un fournisseur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gmarket">G-Market Korea</SelectItem>
                          <SelectItem value="coupang">Coupang</SelectItem>
                          <SelectItem value="naver">Naver Shopping</SelectItem>
                          <SelectItem value="custom">API Personnalisée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>URL Endpoint</Label>
                        <Input placeholder="https://api.fournisseur.com/products" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Clé API</Label>
                        <Input type="password" placeholder="sk_live_..." />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Fréquence de Synchronisation</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner la fréquence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Temps réel</SelectItem>
                          <SelectItem value="hourly">Toutes les heures</SelectItem>
                          <SelectItem value="daily">Quotidien</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full">
                      Tester la Connexion API
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="file">
                <Card>
                  <CardHeader>
                    <CardTitle>Import par Fichier CSV/Excel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-primary mb-2">
                        📥 Téléchargez notre template pour formater vos données correctement
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Template Excel
                        </Button>
                        <Button variant="outline" size="sm">
                          Template CSV
                        </Button>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        {file ? file.name : 'Cliquez pour télécharger votre fichier CSV/Excel'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Formats supportés: .csv, .xlsx, .xls
                      </p>
                      <Input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>

                    {file && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Taille: {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Badge variant="secondary">Prêt</Badge>
                        </div>
                        
                        <Button className="w-full">
                          Analyser et Importer
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}