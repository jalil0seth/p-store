import { Partner, Category, Review, Resource } from '../types';
import { 
  Laptop, Paintbrush, Video, Building, 
  Users, Database, Shield, Cloud 
} from 'lucide-react';

export const PARTNERS: Partner[] = [
  {
    id: 'adobe',
    name: 'Adobe',
    logo: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=120&h=120',
    description: 'Creative Cloud Solutions',
    url: '/partners/adobe'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?auto=format&fit=crop&w=120&h=120',
    description: 'Enterprise Software',
    url: '/partners/microsoft'
  },
  {
    id: 'autodesk',
    name: 'Autodesk',
    logo: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=120&h=120',
    description: 'Design & Engineering',
    url: '/partners/autodesk'
  },
  {
    id: 'atlassian',
    name: 'Atlassian',
    logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=120&h=120',
    description: 'Team Collaboration',
    url: '/partners/atlassian'
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'design',
    name: 'Design Software',
    description: 'Professional creative tools for designers',
    icon: 'Paintbrush',
    slug: 'design',
    productCount: 24
  },
  {
    id: 'development',
    name: 'Development Tools',
    description: 'IDEs and coding environments',
    icon: 'Laptop',
    slug: 'development',
    productCount: 18
  },
  {
    id: 'video',
    name: 'Video & Animation',
    description: 'Professional video editing software',
    icon: 'Video',
    slug: 'video',
    productCount: 12
  },
  {
    id: 'architecture',
    name: 'Architecture & CAD',
    description: '3D modeling and CAD tools',
    icon: 'Building',
    slug: 'architecture',
    productCount: 15
  },
  {
    id: 'collaboration',
    name: 'Team Collaboration',
    description: 'Tools for team productivity',
    icon: 'Users',
    slug: 'collaboration',
    productCount: 20
  },
  {
    id: 'database',
    name: 'Database & Analytics',
    description: 'Data management solutions',
    icon: 'Database',
    slug: 'database',
    productCount: 16
  },
  {
    id: 'security',
    name: 'Security & Privacy',
    description: 'Enterprise security tools',
    icon: 'Shield',
    slug: 'security',
    productCount: 14
  },
  {
    id: 'cloud',
    name: 'Cloud Services',
    description: 'Cloud computing solutions',
    icon: 'Cloud',
    slug: 'cloud',
    productCount: 22
  }
];

export const FEATURED_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow',
    content: 'The software licensing platform has transformed how we manage our team\'s tools. Incredible service and support.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150',
    date: '2024-03-01'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Engineering Lead',
    company: 'Innovate Inc',
    content: 'Streamlined our entire software procurement process. The automated license management is a game-changer.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150',
    date: '2024-02-28'
  },
  {
    id: '3',
    name: 'Emily Watson',
    role: 'Design Director',
    company: 'Creative Studios',
    content: 'Finally, a platform that understands enterprise software needs. The support team is exceptional.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150',
    date: '2024-02-25'
  }
];

export const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Software License Management Guide',
    description: 'Learn best practices for managing enterprise software licenses.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&h=400',
    category: 'Guide',
    url: '/resources/license-management',
    date: '2024-03-01'
  },
  {
    id: '2',
    title: 'Cost Optimization Strategies',
    description: 'Optimize your software spending with these proven strategies.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=400',
    category: 'Whitepaper',
    url: '/resources/cost-optimization',
    date: '2024-02-28'
  },
  {
    id: '3',
    title: 'Enterprise Security Checklist',
    description: 'Essential security considerations for enterprise software.',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&h=400',
    category: 'Checklist',
    url: '/resources/security-checklist',
    date: '2024-02-25'
  }
];