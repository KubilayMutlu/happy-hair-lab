import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.variants?.[0]);
  };

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      to={`/produit/${product.slug}`}
      className={cn(
        'group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-secondary overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              -{Math.round((1 - product.price / product.compareAtPrice!) * 100)}%
            </span>
          )}
          {product.category === 'camouflage' && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
              Camouflage
            </span>
          )}
        </div>

        {/* Quick add button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="gold"
            className="rounded-full"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.category === 'anti-chute' ? 'Anti-chute' : 'Camouflage'}
        </p>
        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.shortDescription}
        </p>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            {product.price.toFixed(2)} €
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {product.compareAtPrice?.toFixed(2)} €
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
