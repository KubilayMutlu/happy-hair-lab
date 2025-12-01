import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { articles } from '@/data/products';

const Articles = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-accent font-medium text-sm tracking-wide uppercase mb-2 block">
              Le Lab
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Articles & Conseils
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos articles documentés sur la santé capillaire, 
              les dernières recherches scientifiques et nos conseils d'experts.
            </p>
          </motion.div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/article/${article.slug}`}
                  className="group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-[16/10] bg-secondary overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="bg-secondary px-2.5 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime} min
                      </span>
                    </div>

                    <h2 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                      {article.title}
                    </h2>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>

                    <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                      Lire l'article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Articles;
