import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Tag, Loader2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Promotion {
  id: string;
  name: string;
  code: string | null;
  discount_type: string;
  discount_value: number;
  min_purchase: number | null;
  start_date: string | null;
  end_date: string | null;
  active: boolean | null;
  created_at: string | null;
}

const emptyPromotion = {
  name: '',
  code: '',
  discount_type: 'percentage',
  discount_value: 0,
  min_purchase: null as number | null,
  start_date: '',
  end_date: '',
  active: true,
};

const AdminPromotions = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState(emptyPromotion);

  const { data: promotions, isLoading } = useQuery({
    queryKey: ['admin-promotions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Promotion[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyPromotion) => {
      const { error } = await supabase
        .from('promotions')
        .insert({
          name: data.name,
          code: data.code?.toUpperCase() || null,
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          min_purchase: data.min_purchase || null,
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          active: data.active,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] });
      toast.success('Promotion créée avec succès');
      handleCloseDialog();
    },
    onError: () => {
      toast.error('Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof emptyPromotion }) => {
      const { error } = await supabase
        .from('promotions')
        .update({
          name: data.name,
          code: data.code?.toUpperCase() || null,
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          min_purchase: data.min_purchase || null,
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          active: data.active,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] });
      toast.success('Promotion mise à jour');
      handleCloseDialog();
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] });
      toast.success('Promotion supprimée');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('promotions')
        .update({ active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPromotion(null);
    setFormData(emptyPromotion);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromotion(promo);
    setFormData({
      name: promo.name,
      code: promo.code || '',
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      min_purchase: promo.min_purchase,
      start_date: promo.start_date ? promo.start_date.split('T')[0] : '',
      end_date: promo.end_date ? promo.end_date.split('T')[0] : '',
      active: promo.active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.discount_value) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    if (editingPromotion) {
      updateMutation.mutate({ id: editingPromotion.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isValidPromo = (promo: Promotion) => {
    const now = new Date();
    if (promo.start_date && new Date(promo.start_date) > now) return false;
    if (promo.end_date && new Date(promo.end_date) < now) return false;
    return promo.active;
  };

  return (
    <AdminLayout title="Promotions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Gérez vos codes promo et remises
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingPromotion(null);
                setFormData(emptyPromotion);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPromotion ? 'Modifier la promotion' : 'Créer une promotion'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Nom de la promotion *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Offre de bienvenue"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="code">Code promo</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="Ex: BIENVENUE20"
                      className="mt-1 uppercase"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount_type">Type de remise *</Label>
                    <Select
                      value={formData.discount_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, discount_type: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                        <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="discount_value">Valeur *</Label>
                    <Input
                      id="discount_value"
                      type="number"
                      min="0"
                      step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                      value={formData.discount_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))}
                      placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="min_purchase">Minimum d'achat (€)</Label>
                    <Input
                      id="min_purchase"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.min_purchase ?? ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_purchase: e.target.value ? parseFloat(e.target.value) : null }))}
                      placeholder="Optionnel"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="start_date">Date de début</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">Date de fin</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                    />
                    <Label htmlFor="active">Promotion active</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingPromotion ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Example Code */}
        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <Tag className="w-4 h-4 text-accent" />
            Exemple de code promo
          </div>
          <p className="text-sm text-muted-foreground">
            Créez le code <span className="font-mono font-medium text-foreground">BIENVENUE20</span> avec 
            une remise de 20% pour offrir une réduction aux nouveaux clients.
          </p>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : promotions && promotions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Remise</TableHead>
                  <TableHead>Min. achat</TableHead>
                  <TableHead>Validité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.name}</TableCell>
                    <TableCell>
                      {promo.code ? (
                        <code className="px-2 py-1 bg-secondary rounded text-sm">
                          {promo.code}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {promo.discount_type === 'percentage' 
                        ? `${promo.discount_value}%`
                        : `${promo.discount_value.toFixed(2)} €`
                      }
                    </TableCell>
                    <TableCell>
                      {promo.min_purchase 
                        ? `${promo.min_purchase.toFixed(2)} €`
                        : <span className="text-muted-foreground">—</span>
                      }
                    </TableCell>
                    <TableCell className="text-sm">
                      {promo.start_date || promo.end_date ? (
                        <span className="text-muted-foreground">
                          {promo.start_date && new Date(promo.start_date).toLocaleDateString('fr-FR')}
                          {promo.start_date && promo.end_date && ' → '}
                          {promo.end_date && new Date(promo.end_date).toLocaleDateString('fr-FR')}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Illimité</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={promo.active ?? false}
                          onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: promo.id, active: checked })}
                        />
                        <Badge variant={isValidPromo(promo) ? "default" : "secondary"}>
                          {isValidPromo(promo) ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(promo)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm('Supprimer cette promotion ?')) {
                              deleteMutation.mutate(promo.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Aucune promotion créée</p>
              <p className="text-sm text-muted-foreground mt-1">
                Cliquez sur "Nouvelle promotion" pour commencer
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPromotions;
