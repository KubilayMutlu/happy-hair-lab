import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, Minus, Plus, Check, Truck, Shield, RotateCcw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { getProductBySlug, products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || '');
  const { addItem } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
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

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 0;

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
              <img
                src={product.images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={cn(
                      'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                      activeImageIndex === index
                        ? 'border-accent'
                        : 'border-transparent hover:border-border'
                    )}
                  >
                    <img
                      src={image}
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

            {/* Rating */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.round(averageRating)
                          ? 'fill-accent text-accent'
                          : 'fill-muted text-muted'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews.length} avis)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-semibold">
                {(selectedVariant?.price ?? product.price).toFixed(2)} €
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.compareAtPrice.toFixed(2)} €
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Teinte</label>
                <div className="flex gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                        selectedVariant?.id === variant.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      )}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
              onClick={handleAddToCart}
            >
              Ajouter au panier
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
          </motion.div>
        </div>

        {/* Tabs Content */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
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

          {/* How to use */}
          <div className="bg-secondary/50 p-6 rounded-xl">
            <h3 className="font-semibold mb-4">Mode d'emploi</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {product.howToUse}
            </p>
            <h4 className="font-medium text-sm mb-2">Résultats attendus</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.expectedResults}
            </p>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8">Avis clients</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="bg-card p-6 rounded-xl">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">"{review.content}"</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{review.author}</span>
                    {review.verified && (
                      <span className="text-xs text-accent flex items-center gap-1">
                        <Check className="w-3 h-3" /> Achat vérifié
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8">Produits complémentaires</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
