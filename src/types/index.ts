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
  inStock: boolean;
  featured: boolean;
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

export interface HomeConfig {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    image: string;
  };
  featuredProducts: {
    title: string;
    subtitle: string;
    productIds: string[];
  };
  reviews: {
    title: string;
    subtitle: string;
    reviewIds: string[];
  };
}

export interface WebsiteConfig {
  name: string;
  description: string;
  logo: string;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  footerLinks: {
    title: string;
    links: Array<{
      text: string;
      url: string;
    }>;
  }[];
}