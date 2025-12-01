import { motion } from 'framer-motion';
import { Leaf, FlaskConical, Award, Heart } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const values = [
  {
    icon: Leaf,
    title: 'Naturalité',
    description: 'Nous sélectionnons des ingrédients d\'origine naturelle, respectueux de votre cuir chevelu et de l\'environnement.',
  },
  {
    icon: FlaskConical,
    title: 'Innovation',
    description: 'Nos formules combinent les dernières avancées scientifiques avec le meilleur de la nature.',
  },
  {
    icon: Award,
    title: 'Qualité premium',
    description: 'Fabrication française, contrôles rigoureux, efficacité prouvée par des études cliniques.',
  },
  {
    icon: Heart,
    title: 'Bienveillance',
    description: 'Nous comprenons vos préoccupations et développons des solutions adaptées à vos besoins.',
  },
];

const About = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="text-accent font-medium text-sm tracking-wide uppercase mb-4 block">
              Notre histoire
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              À propos de Happy Hair Lab
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Chez Happy Hair Lab, nous avons la conviction que chacun mérite des solutions 
              capillaires efficaces, naturelles et discrètes. Notre mission : vous aider 
              à prendre soin de vos cheveux avec des produits premium qui font vraiment 
              la différence.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-secondary/50 rounded-2xl p-8 md:p-12 mb-16"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Notre mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Développer des soins capillaires qui allient efficacité scientifique 
                et naturalité. Nous refusons les compromis : nos formules sont 
                concentrées en actifs puissants, tout en restant douces et respectueuses.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Chaque produit Happy Hair Lab est le fruit de recherches approfondies 
                et de tests rigoureux. Nous travaillons avec des experts en dermatologie 
                et en trichologie pour vous offrir le meilleur.
              </p>
            </div>
          </motion.div>

          {/* Values */}
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-semibold text-center mb-12"
            >
              Nos valeurs
            </motion.h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card p-6 rounded-xl text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Promise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Notre engagement qualité
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-accent mb-2">100%</div>
                <p className="text-sm text-primary-foreground/70">Fabriqué en France</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">0%</div>
                <p className="text-sm text-primary-foreground/70">Parabènes & sulfates</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">30j</div>
                <p className="text-sm text-primary-foreground/70">Satisfait ou remboursé</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
