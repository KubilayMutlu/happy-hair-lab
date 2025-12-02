import { Link } from 'react-router-dom';
import { ShoppingBag, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Generic product interface that works with both static and DB products
interface ProductCardProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  compareAtPrice?: number | null;
  short_description?: string | null;
  shortDescription?: string;
  category: string;
  images?: { image_url: string }[] | string[];
}

interface ProductCardProps {
  product: ProductCardProduct;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  // Handle both DB format (compare_at_price) and static format (compareAtPrice)
  const compareAtPrice = product.compare_at_price ?? product.compareAtPrice;
  const shortDescription = product.short_description ?? product.shortDescription;
  
  // Handle both DB format (images: [{image_url}]) and static format (images: string[])
  const getImageUrl = () => {
    if (!product.images || product.images.length === 0) return null;
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') return firstImage;
    return firstImage.image_url;
  };
  
  const imageUrl = getImageUrl();
  const hasDiscount = compareAtPrice && compareAtPrice > product.price;

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
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageOff className="w-12 h-12" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              -{Math.round((1 - product.price / compareAtPrice!) * 100)}%
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Note: Cart functionality would need to be updated for DB products
            }}
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
          {shortDescription}
        </p>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            {product.price.toFixed(2)} €
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {compareAtPrice?.toFixed(2)} €
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
