import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../utils/constants';
import { 
  Laptop, Paintbrush, Video, Building, 
  Users, Database, Shield, Cloud 
} from 'lucide-react';

const iconMap = {
  Laptop,
  Paintbrush,
  Video,
  Building,
  Users,
  Database,
  Shield,
  Cloud,
};

export default function Categories() {
  return (
    <section className="py-32 bg-white dark:bg-gray-900">
      <div className="max-w-[70rem] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Browse by Category
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find the perfect software solution for your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((category, index) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap];
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={`/products?category=${category.slug}`}
                  className="group block relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-${category.slug}-50 dark:bg-${category.slug}-900/20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 text-${category.slug}-500 dark:text-${category.slug}-400`} />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {category.description}
                    </p>
                    
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      {category.productCount} Products
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-500/10 dark:to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}