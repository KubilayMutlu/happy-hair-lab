import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

type CategoryFilter = 'all' | 'anti-chute' | 'camouflage';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') as CategoryFilter || 'all';
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>(initialCategory);

  const { data: products, isLoading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeFilter === 'all') return products;
    return products.filter(p => p.category === activeFilter);
  }, [products, activeFilter]);

  const handleFilterChange = (filter: CategoryFilter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', filter);
    }
    setSearchParams(searchParams);
  };

  const filters: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'anti-chute', label: 'Anti-chute' },
    { value: 'camouflage', label: 'Camouflage' },
  ];

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Nos produits
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des formules actives éprouvées pour des résultats visibles. 
              Ingrédients sélectionnés pour favoriser la résistance du cheveu.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-2 mb-12"
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleFilterChange(filter.value)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                  activeFilter === filter.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-destructive">
                Erreur lors du chargement des produits.
              </p>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Aucun produit trouvé dans cette catégorie.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
