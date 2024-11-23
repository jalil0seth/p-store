export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  specs: Record<string, string[]>;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
  date: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  url: string;
  date: string;
}