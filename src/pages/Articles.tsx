import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  author: string | null;
  category: string | null;
  read_time: number | null;
  created_at: string | null;
}

const Articles = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, image_url, author, category, read_time, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    },
  });

  return (
    <Layout>
      <Helmet>
        <title>Articles & Conseils Capillaires | Happy Hair Lab</title>
        <meta 
          name="description" 
          content="Découvrez nos articles experts sur la santé capillaire, les traitements anti-chute et les conseils pour prendre soin de vos cheveux naturellement." 
        />
        <meta name="keywords" content="articles cheveux, conseils capillaires, anti-chute, alopécie, santé des cheveux, soin cheveux homme" />
        <link rel="canonical" href="https://happyhairlab.fr/articles" />
        <meta property="og:title" content="Articles & Conseils Capillaires | Happy Hair Lab" />
        <meta property="og:description" content="Découvrez nos articles experts sur la santé capillaire et les traitements anti-chute." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://happyhairlab.fr/articles" />
      </Helmet>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.header
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
          </motion.header>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Articles Grid */}
          {articles && articles.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  itemScope
                  itemType="https://schema.org/Article"
                >
                  <Link
                    to={`/article/${article.slug}`}
                    className="group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-[16/10] bg-secondary overflow-hidden">
                      <img
                        src={article.image_url || '/placeholder.svg'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        itemProp="image"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        {article.category && (
                          <span className="bg-secondary px-2.5 py-1 rounded-full" itemProp="articleSection">
                            {article.category}
                          </span>
                        )}
                        {article.read_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.read_time} min
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors" itemProp="headline">
                        {article.title}
                      </h2>
                      
                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4" itemProp="description">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                          Lire l'article
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        {article.author && (
                          <span className="text-xs text-muted-foreground" itemProp="author">
                            {article.author}
                          </span>
                        )}
                      </div>
                      
                      <meta itemProp="datePublished" content={article.created_at || ''} />
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {articles && articles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Aucun article disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Happy Hair Lab - Articles & Conseils",
          "description": "Articles experts sur la santé capillaire et les soins anti-chute",
          "url": "https://happyhairlab.fr/articles",
          "publisher": {
            "@type": "Organization",
            "name": "Happy Hair Lab",
            "logo": {
              "@type": "ImageObject",
              "url": "https://happyhairlab.fr/logo.jpg"
            }
          }
        })}
      </script>
    </Layout>
  );
};

export default Articles;
