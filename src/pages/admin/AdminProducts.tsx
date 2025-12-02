import { useState } from 'react';
import { Plus, Pencil, Trash2, ImagePlus, X, Save, Loader2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  useProducts,
  useUpdateProduct,
  useCreateProduct,
  useDeleteProduct,
  useUploadProductImage,
  useDeleteProductImage,
  ProductWithImages,
  DBProduct,
} from '@/hooks/useProducts';

const AdminProducts = () => {
  const { toast } = useToast();
  const { data: products, isLoading } = useProducts();
  const updateProduct = useUpdateProduct();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const uploadImage = useUploadProductImage();
  const deleteImage = useDeleteProductImage();

  const [editingProduct, setEditingProduct] = useState<ProductWithImages | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState<Partial<DBProduct>>({});

  const openEditDialog = (product: ProductWithImages) => {
    setEditingProduct(product);
    setIsCreateMode(false);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      short_description: product.short_description,
      price: product.price,
      compare_at_price: product.compare_at_price,
      category: product.category,
      ingredients: product.ingredients,
      benefits: product.benefits,
      how_to_use: product.how_to_use,
      expected_results: product.expected_results,
      in_stock: product.in_stock,
      featured: product.featured,
    });
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setIsCreateMode(true);
    setFormData({
      name: '',
      slug: '',
      description: '',
      short_description: '',
      price: 0,
      compare_at_price: null,
      category: 'anti-chute',
      ingredients: [],
      benefits: [],
      how_to_use: '',
      expected_results: '',
      in_stock: true,
      featured: false,
    });
  };

  const closeDialog = () => {
    setEditingProduct(null);
    setIsCreateMode(false);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      if (isCreateMode) {
        await createProduct.mutateAsync(formData as any);
        toast({ title: 'Produit créé', description: 'Le produit a été créé avec succès.' });
      } else if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, updates: formData });
        toast({ title: 'Produit mis à jour', description: 'Les modifications ont été enregistrées.' });
      }
      closeDialog();
    } catch (error: any) {
      toast({ 
        title: 'Erreur', 
        description: error.message || 'Une erreur est survenue.', 
        variant: 'destructive' 
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: 'Produit supprimé', description: 'Le produit a été supprimé.' });
    } catch (error: any) {
      toast({ 
        title: 'Erreur', 
        description: error.message || 'Impossible de supprimer le produit.', 
        variant: 'destructive' 
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct || !e.target.files?.[0]) return;
    
    try {
      await uploadImage.mutateAsync({ 
        productId: editingProduct.id, 
        file: e.target.files[0] 
      });
      toast({ title: 'Image ajoutée', description: 'L\'image a été uploadée avec succès.' });
      // Refresh the editing product
      const updatedProducts = await products;
      const updated = updatedProducts?.find(p => p.id === editingProduct.id);
      if (updated) setEditingProduct(updated);
    } catch (error: any) {
      toast({ 
        title: 'Erreur', 
        description: error.message || 'Impossible d\'uploader l\'image.', 
        variant: 'destructive' 
      });
    }
  };

  const handleImageDelete = async (imageId: string, imageUrl: string) => {
    try {
      await deleteImage.mutateAsync({ id: imageId, imageUrl });
      toast({ title: 'Image supprimée' });
      // Refresh the editing product
      if (editingProduct) {
        setEditingProduct({
          ...editingProduct,
          images: editingProduct.images.filter(img => img.id !== imageId)
        });
      }
    } catch (error: any) {
      toast({ 
        title: 'Erreur', 
        description: error.message || 'Impossible de supprimer l\'image.', 
        variant: 'destructive' 
      });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (isLoading) {
    return (
      <AdminLayout title="Produits">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Produits">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {products?.length || 0} produit(s) au total
          </p>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un produit
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products?.map(product => (
            <div
              key={product.id}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              {/* Product Image */}
              <div className="aspect-square bg-secondary relative">
                {product.images[0] ? (
                  <img
                    src={product.images[0].image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImagePlus className="w-12 h-12" />
                  </div>
                )}
                {product.featured && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    Mis en avant
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {product.short_description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{product.price.toFixed(2)} €</span>
                    {product.compare_at_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.compare_at_price.toFixed(2)} €
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit/Create Dialog */}
        <Dialog open={!!editingProduct || isCreateMode} onOpenChange={() => closeDialog()}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isCreateMode ? 'Nouveau produit' : 'Modifier le produit'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Images Section - Only for editing */}
              {!isCreateMode && editingProduct && (
                <div className="space-y-3">
                  <Label>Images du produit</Label>
                  <div className="flex flex-wrap gap-3">
                    {editingProduct.images.map(image => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image_url}
                          alt=""
                          className="w-24 h-24 object-cover rounded-lg border border-border"
                        />
                        <button
                          onClick={() => handleImageDelete(image.id, image.image_url)}
                          className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadImage.isPending}
                      />
                      {uploadImage.isPending ? (
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      ) : (
                        <ImagePlus className="w-6 h-6 text-muted-foreground" />
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        name: e.target.value,
                        slug: isCreateMode ? generateSlug(e.target.value) : formData.slug
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Description courte</Label>
                <Input
                  id="short_description"
                  value={formData.short_description || ''}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description complète</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">Prix barré (€)</Label>
                  <Input
                    id="compare_at_price"
                    type="number"
                    step="0.01"
                    value={formData.compare_at_price || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      compare_at_price: e.target.value ? parseFloat(e.target.value) : null 
                    })}
                    placeholder="Optionnel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category || 'anti-chute'}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anti-chute">Anti-chute</SelectItem>
                      <SelectItem value="camouflage">Camouflage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingrédients (un par ligne)</Label>
                <Textarea
                  id="ingredients"
                  rows={3}
                  value={formData.ingredients?.join('\n') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    ingredients: e.target.value.split('\n').filter(Boolean) 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Bénéfices (un par ligne)</Label>
                <Textarea
                  id="benefits"
                  rows={3}
                  value={formData.benefits?.join('\n') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    benefits: e.target.value.split('\n').filter(Boolean) 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="how_to_use">Mode d'emploi</Label>
                <Textarea
                  id="how_to_use"
                  rows={3}
                  value={formData.how_to_use || ''}
                  onChange={(e) => setFormData({ ...formData, how_to_use: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_results">Résultats attendus</Label>
                <Textarea
                  id="expected_results"
                  rows={3}
                  value={formData.expected_results || ''}
                  onChange={(e) => setFormData({ ...formData, expected_results: e.target.value })}
                />
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.in_stock ?? true}
                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span className="text-sm">En stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured ?? false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span className="text-sm">Mis en avant</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDialog}>
                Annuler
              </Button>
              <Button 
                onClick={handleSave}
                disabled={updateProduct.isPending || createProduct.isPending}
              >
                {(updateProduct.isPending || createProduct.isPending) ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
