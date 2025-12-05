import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {
    const updateOrderStatus = async () => {
      if (!orderId) return;

      try {
        // Update order status to confirmed
        const { error } = await supabase
          .from('orders')
          .update({ 
            status: 'confirmed',
            stripe_session_id: searchParams.get('session_id')
          })
          .eq('id', orderId);

        if (error) {
          console.error('Error updating order:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsUpdating(false);
      }
    };

    updateOrderStatus();
  }, [orderId, searchParams]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-semibold mb-4">Commande confirmée !</h1>
          
          <p className="text-muted-foreground mb-8">
            Merci pour votre commande. Vous recevrez un email de confirmation avec les détails de votre commande.
          </p>

          {orderId && (
            <div className="bg-card rounded-xl border border-border p-4 mb-8">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>Numéro de commande:</span>
              </div>
              <p className="font-mono text-sm mt-1 break-all">{orderId}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/compte/commandes">
                Voir mes commandes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/produits">
                Continuer mes achats
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
