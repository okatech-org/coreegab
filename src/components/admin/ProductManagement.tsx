import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Download, 
  Search, 
  Filter,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { ProductGridSkeleton } from '@/components/SkeletonLoaders';
import { LazyImage } from '@/components/LazyImage';

const productSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  price_krw: z.number().min(1, 'Le prix doit être supérieur à 0'),
  category: z.string().min(1, 'Catégorie requise'),
  image_url: z.string().url().optional().or(z.literal('')),
  stock_quantity: z.number().min(0).optional(),
  in_stock: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export const ProductManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { toast } = useToast();
  
  // Hooks pour les opérations CRUD
  const { data: productsResult, isLoading, refetch } = useProducts({
    search: searchTerm || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
  });
  
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      in_stock: true,
      stock_quantity: 0,
    },
  });

  const products = productsResult?.data || [];

  // Soumettre le formulaire de produit
  const onSubmitProduct = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        // Mise à jour
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          ...data,
          category: data.category as any,
        });
      } else {
        // Création
        await createProduct.mutateAsync(data as any);
      }
      
      reset();
      setEditingProduct(null);
      setActiveTab('list');
      refetch();
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  // Modifier un produit
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('description', product.description || '');
    setValue('price_krw', product.price_krw);
    setValue('category', product.category);
    setValue('image_url', product.image_url || '');
    setValue('stock_quantity', product.stock_quantity || 0);
    setValue('in_stock', product.in_stock);
    setActiveTab('form');
  };

  // Supprimer un produit
  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct.mutateAsync(productId);
        refetch();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Nouveau produit
  const handleNewProduct = () => {
    reset();
    setEditingProduct(null);
    setActiveTab('form');
  };

  // Import/Export de produits
  const handleImportProducts = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Ici, vous implémenteriez la logique d'import
        toast({
          title: "Import en cours",
          description: `Traitement du fichier ${file.name}...`,
        });
      }
    };
    input.click();
  };

  const handleExportProducts = () => {
    // Ici, vous implémenteriez l'export
    const csvContent = products.map(p => 
      `${p.name},${p.category},${p.price_krw},${p.stock_quantity || 0}`
    ).join('\n');
    
    const blob = new Blob([`Nom,Catégorie,Prix KRW,Stock\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `produits_coregab_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = ['vehicles', 'electronics', 'appliances', 'parts'];

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Produits</h1>
          <p className="text-muted-foreground">{products.length} produits au total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportProducts}>
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" onClick={handleExportProducts}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleNewProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau produit
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Liste des produits</TabsTrigger>
          <TabsTrigger value="form">
            {editingProduct ? 'Modifier' : 'Ajouter'} un produit
          </TabsTrigger>
          <TabsTrigger value="analytics">Statistiques</TabsTrigger>
        </TabsList>

        {/* Liste des produits */}
        <TabsContent value="list" className="space-y-4">
          {/* Filtres */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Grille de produits */}
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                      <LazyImage
                        src={product.image_url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{product.category}</Badge>
                        <span className="font-bold text-primary">
                          {product.price_krw.toLocaleString()} KRW
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Stock: {product.stock_quantity || 0}
                        </span>
                        <Badge variant={product.in_stock ? "default" : "secondary"}>
                          {product.in_stock ? 'En stock' : 'Rupture'}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                          className="flex-1"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Formulaire de produit */}
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmitProduct)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du produit</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Samsung Galaxy S24"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Description détaillée du produit..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_krw">Prix (KRW)</Label>
                    <Input
                      id="price_krw"
                      type="number"
                      {...register('price_krw', { valueAsNumber: true })}
                      placeholder="1000000"
                    />
                    {errors.price_krw && (
                      <p className="text-sm text-destructive">{errors.price_krw.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      {...register('stock_quantity', { valueAsNumber: true })}
                      placeholder="10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL de l'image</Label>
                    <Input
                      id="image_url"
                      {...register('image_url')}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      reset();
                      setEditingProduct(null);
                      setActiveTab('list');
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createProduct.isPending || updateProduct.isPending}
                    className="flex-1"
                  >
                    {(createProduct.isPending || updateProduct.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingProduct ? 'Mettre à jour' : 'Créer le produit'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistiques */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total produits</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Produits en stock</p>
                    <p className="text-2xl font-bold">
                      {products.filter(p => p.in_stock).length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ruptures de stock</p>
                    <p className="text-2xl font-bold">
                      {products.filter(p => (p.stock_quantity || 0) === 0).length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Catégories</p>
                    <p className="text-2xl font-bold">
                      {new Set(products.map(p => p.category)).size}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Répartition par catégorie */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Répartition par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category) => {
                  const count = products.filter(p => p.category === category).length;
                  const percentage = products.length > 0 ? (count / products.length) * 100 : 0;
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="capitalize">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
