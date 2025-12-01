import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <Layout showPromoBanner={false}>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center"
          >
            <span className="text-8xl font-bold text-accent/20 block mb-4">404</span>
            <h1 className="text-3xl font-semibold mb-4">Page non trouvée</h1>
            <p className="text-muted-foreground mb-8">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Button asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
