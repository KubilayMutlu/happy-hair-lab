import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, RefreshCw, ChevronDown, ChevronUp, MapPin, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Product, ProductVariant } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  product_id: string | null;
  variant_id: string | null;
}

interface ShippingAddress {
  first_name?: string;
  last_name?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  shipping_address: ShippingAddress | null;
  created_at: string;
  updated_at: string;
  notes: string | null;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'En attente de paiement', icon: Clock, color: 'text-yellow-500' },
  processing: { label: 'Traitement de la demande', icon: Package, color: 'text-blue-500' },
  shipped: { label: 'Livraison en cours', icon: Truck, color: 'text-purple-500' },
  delivered: { label: 'Livraison effectuée', icon: CheckCircle, color: 'text-green-500' },
  cancelled: { label: 'Annulée', icon: Clock, color: 'text-destructive' },
};

const Orders = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/compte');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map(o => o.id);
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;

        const ordersWithItems = ordersData.map(order => ({
          ...order,
          shipping_address: order.shipping_address as ShippingAddress | null,
          order_items: (itemsData || []).filter(item => item.order_id === order.id),
        }));

        setOrders(ordersWithItems);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos commandes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleReorder = async (order: Order) => {
    try {
      for (const item of order.order_items) {
        if (item.product_id) {
          // Fetch the product from the database
          const { data: productData } = await supabase
            .from('products')
            .select('*, product_images(*), product_variants(*)')
            .eq('id', item.product_id)
            .maybeSingle();

          if (productData) {
            const product: Product = {
              id: productData.id,
              name: productData.name,
              slug: productData.slug,
              description: productData.description || '',
              shortDescription: productData.short_description || '',
              price: Number(productData.price),
              compareAtPrice: productData.compare_at_price ? Number(productData.compare_at_price) : undefined,
              images: (productData.product_images as any[])
                ?.sort((a, b) => a.position - b.position)
                .map((img) => img.image_url) || [],
              category: productData.category as 'anti-chute' | 'camouflage',
              variants: (productData.product_variants as any[])?.map((v) => ({
                id: v.id,
                name: v.name,
                price: Number(v.price),
                inStock: v.in_stock,
              })),
              ingredients: productData.ingredients || [],
              benefits: productData.benefits || [],
              howToUse: productData.how_to_use || '',
              expectedResults: productData.expected_results || '',
              reviews: [],
              inStock: productData.in_stock ?? true,
              featured: productData.featured ?? false,
            };

            const variant: ProductVariant | undefined = item.variant_id 
              ? product.variants?.find((v) => v.id === item.variant_id)
              : undefined;

            addItem(product, variant, item.quantity);
          }
        }
      }
      
      toast({
        title: 'Articles ajoutés',
        description: 'Les articles ont été ajoutés à votre panier.',
      });
    } catch (error) {
      console.error('Error reordering:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de renouveler la commande.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const inProgressOrders = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status));
  const completedOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const OrderCard = ({ order }: { order: Order }) => {
    const isExpanded = expandedOrders.has(order.id);
    const config = statusConfig[order.status] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        {/* Header */}
        <button
          onClick={() => toggleOrderExpanded(order.id)}
          className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={cn('p-2 rounded-full bg-secondary', config.color)}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm md:text-base">
                Commande du {formatDate(order.created_at)}
              </p>
              <p className={cn('text-sm', config.color)}>{config.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold">{formatPrice(order.total_amount)}</span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-border">
            {/* Order Items */}
            <div className="p-4 md:p-6 space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground mb-3">Récapitulatif</h4>
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    {item.variant_name && (
                      <p className="text-sm text-muted-foreground">{item.variant_name}</p>
                    )}
                    <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                  </div>
                  <span className="font-medium">{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-border font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>

            {/* Shipping Info */}
            {order.shipping_address && (
              <div className="p-4 md:p-6 border-t border-border bg-secondary/20">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Adresse de livraison</h4>
                    <p className="text-sm">
                      {order.shipping_address.first_name} {order.shipping_address.last_name}
                    </p>
                    <p className="text-sm">{order.shipping_address.address}</p>
                    <p className="text-sm">
                      {order.shipping_address.postal_code} {order.shipping_address.city}
                    </p>
                    <p className="text-sm">{order.shipping_address.country}</p>
                    {order.shipping_address.phone && (
                      <p className="text-sm text-muted-foreground mt-1">{order.shipping_address.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Status Timeline for in-progress orders */}
            {['processing', 'shipped'].includes(order.status) && (
              <div className="p-4 md:p-6 border-t border-border">
                <h4 className="font-medium text-sm text-muted-foreground mb-4">Suivi de commande</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Commande confirmée</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      ['processing', 'shipped', 'delivered'].includes(order.status) 
                        ? 'bg-green-500/20' 
                        : 'bg-secondary'
                    )}>
                      <Package className={cn(
                        'w-4 h-4',
                        ['processing', 'shipped', 'delivered'].includes(order.status) 
                          ? 'text-green-500' 
                          : 'text-muted-foreground'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">En cours de préparation</p>
                      {['processing', 'shipped', 'delivered'].includes(order.status) && (
                        <p className="text-xs text-muted-foreground">Traitement en cours</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      ['shipped', 'delivered'].includes(order.status) 
                        ? 'bg-green-500/20' 
                        : 'bg-secondary'
                    )}>
                      <Truck className={cn(
                        'w-4 h-4',
                        ['shipped', 'delivered'].includes(order.status) 
                          ? 'text-green-500' 
                          : 'text-muted-foreground'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Expédié</p>
                      {['shipped', 'delivered'].includes(order.status) && (
                        <p className="text-xs text-muted-foreground">Livraison en cours</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      order.status === 'delivered' ? 'bg-green-500/20' : 'bg-secondary'
                    )}>
                      <CheckCircle className={cn(
                        'w-4 h-4',
                        order.status === 'delivered' ? 'text-green-500' : 'text-muted-foreground'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Livré</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reorder Button */}
            <div className="p-4 md:p-6 border-t border-border">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleReorder(order)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Renouveler cette commande
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            {/* Back Button */}
            <button
              onClick={() => navigate('/compte')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à mon compte
            </button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">Mes commandes</h1>
              <p className="text-muted-foreground">
                Suivez vos commandes en cours et consultez votre historique
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-medium mb-2">Aucune commande</h2>
                <p className="text-muted-foreground mb-6">
                  Vous n'avez pas encore passé de commande.
                </p>
                <Button onClick={() => navigate('/produits')}>
                  Découvrir nos produits
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* In Progress Orders */}
                {inProgressOrders.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Commandes en cours ({inProgressOrders.length})
                    </h2>
                    <div className="space-y-4">
                      {inProgressOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Orders */}
                {completedOrders.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Commandes finalisées ({completedOrders.length})
                    </h2>
                    <div className="space-y-4">
                      {completedOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Orders;
