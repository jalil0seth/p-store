import React from 'react';
import { motion } from 'framer-motion';
import { PARTNERS } from '../utils/constants';
import type { Partner } from '../types';

export default function PartnersGrid() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[80rem] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Trusted Partners
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Official software licenses from industry leaders
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {PARTNERS.map((partner, index) => (
            <motion.a
              key={partner.id}
              href={partner.url}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-square mb-4 relative overflow-hidden rounded-xl">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {partner.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {partner.description}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}