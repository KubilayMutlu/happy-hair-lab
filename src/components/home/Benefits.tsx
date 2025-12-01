import { motion } from 'framer-motion';
import { Leaf, FlaskConical, Award, Shield } from 'lucide-react';

const benefits = [
  {
    icon: Leaf,
    title: 'Ingrédients naturels',
    description: 'Formules élaborées à partir d\'actifs naturels sélectionnés pour leur efficacité.',
  },
  {
    icon: FlaskConical,
    title: 'Formules actives',
    description: 'Concentrations optimales d\'actifs scientifiquement validés pour des résultats visibles.',
  },
  {
    icon: Award,
    title: 'Efficacité prouvée',
    description: 'Résultats cliniquement testés et approuvés par des dermatologues.',
  },
  {
    icon: Shield,
    title: 'Qualité premium',
    description: 'Fabrication française dans le respect des normes les plus exigeantes.',
  },
];

const Benefits = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Pourquoi choisir Happy Hair Lab ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une approche scientifique au service de la naturalité
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
