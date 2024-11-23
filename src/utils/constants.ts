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
    id: 'kaspersky',
    name: 'Kaspersky',
    logo: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=120&h=120',
    description: 'Security Solutions',
    url: '/partners/kaspersky'
  },
  {
    id: 'miro',
    name: 'Miro',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=120&h=120',
    description: 'Collaboration Platform',
    url: '/partners/miro'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    logo: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?auto=format&fit=crop&w=120&h=120',
    description: 'Professional Network',
    url: '/partners/linkedin'
  }
];