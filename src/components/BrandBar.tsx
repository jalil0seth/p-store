import React from 'react';
import { motion } from 'framer-motion';

export default function BrandBar() {
  const brands = ['Adobe', 'Autodesk', 'Microsoft', 'Atlassian'];

  return (
    <div className="relative -mt-20 mb-20">
      <div className="max-w-[60rem] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 shadow-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {brands.map((brand, i) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                className="flex items-center justify-center group"
              >
                <span className="text-xl font-semibold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                  {brand}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}