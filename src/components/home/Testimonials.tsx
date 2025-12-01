import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Marc D.',
    rating: 5,
    text: 'Après avoir essayé plusieurs produits, celui-ci est de loin le meilleur. Application facile, résultat très naturel.',
    product: 'Crème Camouflante Noire',
  },
  {
    name: 'Thomas L.',
    rating: 5,
    text: 'Personne ne remarque que je l\'utilise, c\'est exactement ce que je cherchais. La tenue est excellente.',
    product: 'Crème Camouflante Noire',
  },
  {
    name: 'Nicolas R.',
    rating: 5,
    text: 'Après 3 mois d\'utilisation, mes tempes dégarnies montrent des signes de repousse. Je recommande vivement.',
    product: 'Sérum Anti-Chute Intensif',
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium text-sm tracking-wide uppercase mb-2 block">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Des résultats concrets validés par notre communauté
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary-foreground/5 backdrop-blur-sm p-6 rounded-xl border border-primary-foreground/10"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-primary-foreground/90 mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              {/* Author */}
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-primary-foreground/60">{testimonial.product}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
