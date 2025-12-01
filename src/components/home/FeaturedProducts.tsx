import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { getFeaturedProducts } from '@/data/products';

const FeaturedProducts = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium text-sm tracking-wide uppercase mb-2 block">
            Nos best-sellers
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Produits phares
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos formules les plus appréciées, sélectionnées pour leur efficacité
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/produits">Voir tous les produits</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
