import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, Minus, Plus, Check, Truck, Shield, RotateCcw, Loader2, ImageOff } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || '');
  const { data: allProducts } = useProducts();
  const { addItem } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Transform DB product to match Product type for cart
    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      shortDescription: product.short_description || '',
      price: product.price,
      compareAtPrice: product.compare_at_price || undefined,
      images: product.images?.map(img => img.image_url) || [],
      category: product.category as 'anti-chute' | 'camouflage',
      ingredients: product.ingredients || [],
      benefits: product.benefits || [],
      howToUse: product.how_to_use || '',
      expectedResults: product.expected_results || '',
      reviews: [],
      inStock: product.in_stock ?? true,
      featured: product.featured ?? false,
    };
    
    addItem(cartProduct, undefined, quantity);
    toast.success(`${product.name} ajouté au panier`, {
      description: `Quantité: ${quantity}`,
    });
    setQuantity(1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Produit non trouvé</h1>
          <Button asChild>
            <Link to="/produits">Retour aux produits</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedProducts = allProducts
    ?.filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3) || [];

  const images = product.images || [];
  const currentImage = images[activeImageIndex]?.image_url;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <Link
          to="/produits"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux produits
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-square rounded-2xl bg-secondary overflow-hidden mb-4">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageOff className="w-16 h-16" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImageIndex(index)}
                    className={cn(
                      'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                      activeImageIndex === index
                        ? 'border-accent'
                        : 'border-transparent hover:border-border'
                    )}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-xs text-accent uppercase tracking-wide font-medium">
              {product.category === 'anti-chute' ? 'Anti-chute' : 'Camouflage'}
            </span>
            
            <h1 className="text-3xl md:text-4xl font-semibold mt-2 mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-semibold">
                {product.price.toFixed(2)} €
              </span>
              {product.compare_at_price && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.compare_at_price.toFixed(2)} €
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-3 block">Quantité</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="xl"
              className="w-full mb-6"
              disabled={!product.in_stock}
              onClick={handleAddToCart}
            >
              {product.in_stock ? 'Ajouter au panier' : 'Rupture de stock'}
            </Button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border">
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto mb-2 text-accent" />
                <span className="text-xs text-muted-foreground">Livraison offerte dès 50€</span>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 mx-auto mb-2 text-accent" />
                <span className="text-xs text-muted-foreground">Paiement sécurisé</span>
              </div>
              <div className="text-center">
                <RotateCcw className="w-5 h-5 mx-auto mb-2 text-accent" />
                <span className="text-xs text-muted-foreground">Retours sous 30 jours</span>
              </div>
            </div>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Bénéfices</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tabs Content */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="bg-secondary/50 p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Ingrédients actifs</h3>
              <ul className="space-y-2">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* How to use */}
          {(product.how_to_use || product.expected_results) && (
            <div className="bg-secondary/50 p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Mode d'emploi</h3>
              {product.how_to_use && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {product.how_to_use}
                </p>
              )}
              {product.expected_results && (
                <>
                  <h4 className="font-medium text-sm mb-2">Résultats attendus</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.expected_results}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8">Produits complémentaires</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
