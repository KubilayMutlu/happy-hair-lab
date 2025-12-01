export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: 'anti-chute' | 'camouflage';
  variants?: ProductVariant[];
  ingredients: string[];
  benefits: string[];
  howToUse: string;
  expectedResults: string;
  reviews: Review[];
  inStock: boolean;
  featured: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
}
