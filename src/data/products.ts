import { Product, Article } from '@/types/product';
import productCamouflage from '@/assets/product-camouflage.jpg';
import productShampoo from '@/assets/product-shampoo.jpg';
import productSerum from '@/assets/product-serum.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Crème Camouflante Noire',
    slug: 'creme-camouflante-noire',
    description: 'Notre crème camouflante noire offre une couverture naturelle et imperceptible pour les zones clairsemées. Formulée avec des pigments micronisés de haute qualité, elle s\'adapte parfaitement à votre cuir chevelu pour un résultat invisible et durable.',
    shortDescription: 'Couverture naturelle pour zones clairsemées',
    price: 38.00,
    compareAtPrice: 49.00,
    images: [productCamouflage],
    category: 'camouflage',
    variants: [
      { id: 'noir', name: 'Noir', price: 39.00, inStock: true },
    ],
    ingredients: [
      'Cire d\'abeille naturelle',
      'Huile de jojoba bio',
      'Pigments minéraux naturels',
      'Vitamine E',
      'Extrait de bambou'
    ],
    benefits: [
      'Couverture immédiate et naturelle',
      'Résistant à l\'eau et à la transpiration',
      'Formule non comédogène',
      'Enrichi en actifs nourrissants'
    ],
    howToUse: 'Appliquez une petite quantité sur les zones clairsemées avec les doigts ou l\'applicateur fourni. Estompez délicatement pour un résultat naturel. Laissez sécher 2 minutes.',
    expectedResults: 'Résultat visible immédiatement. Tenue jusqu\'à 24h. Résiste à la pluie légère et à la transpiration.',
    reviews: [
      {
        id: 'r1',
        author: 'Marc D.',
        rating: 5,
        title: 'Enfin un produit efficace',
        content: 'Après avoir essayé plusieurs produits, celui-ci est de loin le meilleur. Application facile, résultat très naturel.',
        date: '2024-01-15',
        verified: true
      },
      {
        id: 'r2',
        author: 'Thomas L.',
        rating: 5,
        title: 'Discret et efficace',
        content: 'Personne ne remarque que je l\'utilise, c\'est exactement ce que je cherchais. La tenue est excellente.',
        date: '2024-01-10',
        verified: true
      }
    ],
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Crème Camouflante Châtain',
    slug: 'creme-camouflante-chatain',
    description: 'Notre crème camouflante châtain offre une couverture naturelle et imperceptible pour les zones clairsemées. Formulée avec des pigments micronisés de haute qualité, elle s\'adapte parfaitement à votre cuir chevelu pour un résultat invisible et durable.',
    shortDescription: 'Couverture naturelle teinte châtain',
    price: 39.00,
    compareAtPrice: 49.00,
    images: [productCamouflage],
    category: 'camouflage',
    variants: [
      { id: 'chatain', name: 'Châtain', price: 39.00, inStock: true },
    ],
    ingredients: [
      'Cire d\'abeille naturelle',
      'Huile de jojoba bio',
      'Pigments minéraux naturels',
      'Vitamine E',
      'Extrait de bambou'
    ],
    benefits: [
      'Couverture immédiate et naturelle',
      'Résistant à l\'eau et à la transpiration',
      'Formule non comédogène',
      'Enrichi en actifs nourrissants'
    ],
    howToUse: 'Appliquez une petite quantité sur les zones clairsemées avec les doigts ou l\'applicateur fourni. Estompez délicatement pour un résultat naturel. Laissez sécher 2 minutes.',
    expectedResults: 'Résultat visible immédiatement. Tenue jusqu\'à 24h. Résiste à la pluie légère et à la transpiration.',
    reviews: [
      {
        id: 'r3',
        author: 'Pierre M.',
        rating: 5,
        title: 'Parfait pour ma teinte',
        content: 'Le châtain correspond parfaitement à ma couleur naturelle. Très satisfait du résultat.',
        date: '2024-01-12',
        verified: true
      }
    ],
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Shampoing Anti-Chute Fortifiant',
    slug: 'shampoing-anti-chute-fortifiant',
    description: 'Notre shampoing anti-chute combine les dernières avancées scientifiques avec des ingrédients naturels pour renforcer le cheveu dès la racine. Sa formule active stimule la micro-circulation du cuir chevelu et apporte les nutriments essentiels au bulbe capillaire.',
    shortDescription: 'Formule active pour renforcer le cheveu',
    price: 28.00,
    images: [productShampoo],
    category: 'anti-chute',
    ingredients: [
      'Caféine naturelle',
      'Biotine (Vitamine B7)',
      'Extrait de saw palmetto',
      'Zinc PCA',
      'Huile essentielle de romarin',
      'Kératine végétale'
    ],
    benefits: [
      'Stimule la micro-circulation',
      'Renforce la fibre capillaire',
      'Nourrit le bulbe en profondeur',
      'Usage quotidien possible'
    ],
    howToUse: 'Appliquez sur cheveux mouillés, massez délicatement le cuir chevelu pendant 2-3 minutes pour activer la circulation. Rincez abondamment. Utilisez 3 à 5 fois par semaine.',
    expectedResults: 'Premiers résultats visibles après 4 à 6 semaines d\'utilisation régulière. Cheveux plus denses et résistants après 3 mois.',
    reviews: [
      {
        id: 'r4',
        author: 'Laurent B.',
        rating: 4,
        title: 'Bon produit',
        content: 'J\'utilise ce shampoing depuis 2 mois, je constate moins de cheveux sur l\'oreiller. À suivre.',
        date: '2024-01-08',
        verified: true
      }
    ],
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'Sérum Anti-Chute Intensif',
    slug: 'serum-anti-chute-intensif',
    description: 'Notre sérum concentré en actifs cible directement les causes de la chute de cheveux. Sa formule hautement concentrée pénètre en profondeur pour agir sur le follicule pileux et prolonger la phase de croissance du cheveu.',
    shortDescription: 'Traitement concentré ciblé',
    price: 45.00,
    images: [productSerum],
    category: 'anti-chute',
    ingredients: [
      'Minoxidil végétal',
      'Complexe de peptides',
      'Acide hyaluronique',
      'Niacinamide',
      'Extrait de ginseng',
      'Procapil™'
    ],
    benefits: [
      'Action ciblée sur le follicule',
      'Prolonge le cycle de vie du cheveu',
      'Texture légère non grasse',
      'Compatible avec coiffage'
    ],
    howToUse: 'Appliquez 1ml directement sur le cuir chevelu sec, matin et soir. Massez délicatement. Ne pas rincer. Laissez agir au minimum 4 heures avant le prochain shampoing.',
    expectedResults: 'Réduction visible de la chute après 8 semaines. Repousse constatée après 3-4 mois d\'utilisation assidue.',
    reviews: [
      {
        id: 'r5',
        author: 'Nicolas R.',
        rating: 5,
        title: 'Très efficace',
        content: 'Après 3 mois d\'utilisation, mes tempes dégarnies montrent des signes de repousse. Je recommande vivement.',
        date: '2024-01-05',
        verified: true
      }
    ],
    inStock: true,
    featured: false
  }
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'Comprendre le cycle de vie du cheveu',
    slug: 'comprendre-cycle-vie-cheveu',
    excerpt: 'Découvrez les trois phases du cycle capillaire et comment optimiser la santé de vos cheveux.',
    content: '',
    image: productShampoo,
    author: 'Dr. Sophie Martin',
    date: '2024-01-15',
    category: 'Science',
    readTime: 8
  },
  {
    id: '2',
    title: 'Les actifs anti-chute : ce que dit la science',
    slug: 'actifs-anti-chute-science',
    excerpt: 'Analyse des études cliniques sur les ingrédients les plus efficaces contre la perte de cheveux.',
    content: '',
    image: productSerum,
    author: 'Happy Hair Lab',
    date: '2024-01-10',
    category: 'Recherche',
    readTime: 12
  },
  {
    id: '3',
    title: 'Guide complet du camouflage capillaire',
    slug: 'guide-camouflage-capillaire',
    excerpt: 'Techniques et astuces pour un résultat naturel et invisible au quotidien.',
    content: '',
    image: productCamouflage,
    author: 'Happy Hair Lab',
    date: '2024-01-05',
    category: 'Conseils',
    readTime: 6
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (category: 'anti-chute' | 'camouflage'): Product[] => {
  return products.filter(p => p.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.featured);
};
