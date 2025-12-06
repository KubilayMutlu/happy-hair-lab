import { Link } from 'react-router-dom';
import { ShoppingBag, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';

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
  description?: string | null;
  category: string;
  images?: { image_url: string }[] | string[];
  in_stock?: boolean;
  inStock?: boolean;
  featured?: boolean;
  ingredients?: string[] | null;
  benefits?: string[] | null;
  how_to_use?: string | null;
  expected_results?: string | null;
}

interface ProductCardProps {
  product: ProductCardProduct;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  
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
  
  const getImagesArray = (): string[] => {
    if (!product.images || product.images.length === 0) return [];
    return product.images.map(img => typeof img === 'string' ? img : img.image_url);
  };
  
  const imageUrl = getImageUrl();
  const hasDiscount = compareAtPrice && compareAtPrice > product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Convert to Product type for cart
    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: compareAtPrice ?? undefined,
      description: product.description || '',
      shortDescription: shortDescription || '',
      images: getImagesArray(),
      category: product.category as 'anti-chute' | 'camouflage',
      inStock: product.in_stock ?? product.inStock ?? true,
      featured: product.featured ?? false,
      ingredients: product.ingredients || [],
      benefits: product.benefits || [],
      howToUse: product.how_to_use || '',
      expectedResults: product.expected_results || '',
      reviews: [],
    };
    
    addItem(cartProduct);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

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
