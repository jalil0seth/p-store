export interface StoreConfig {
  id: string;
  store_name: string;
  store_description: string;
  hero_title: string;
  hero_subtitle: string;
  contact_email: string;
  contact_phone: string;
  social_links: {
    twitter: string;
    linkedin: string;
    github: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Collection {
  name: string;
  type: 'base' | 'auth';
  schema: Array<{
    name: string;
    type: string;
    required?: boolean;
    options?: Record<string, any>;
  }>;
}