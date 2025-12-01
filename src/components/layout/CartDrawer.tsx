import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl z-50 animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Votre panier</h2>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-4">Votre panier est vide</p>
                <Button variant="outline" onClick={closeCart} asChild>
                  <Link to="/produits">Découvrir nos produits</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={`${item.product.id}-${item.variant?.id || 'default'}`}
                    className="flex gap-4 p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm leading-tight">
                        {item.product.name}
                      </h3>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.variant.name}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-accent mt-1">
                        {(item.variant?.price ?? item.product.price).toFixed(2)} €
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(
                            item.product.id, 
                            item.quantity - 1, 
                            item.variant?.id
                          )}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(
                            item.product.id, 
                            item.quantity + 1, 
                            item.variant?.id
                          )}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product.id, item.variant?.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-border space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-medium">Total</span>
                <span className="font-semibold">{totalPrice.toFixed(2)} €</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Frais de livraison calculés à l'étape suivante
              </p>
              <Button className="w-full" size="lg" asChild>
                <Link to="/checkout" onClick={closeCart}>
                  Commander
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={closeCart}
              >
                Continuer mes achats
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
