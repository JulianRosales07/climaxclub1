import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Info } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
      {product.imageUrl && !imageError ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
          <div className="w-16 h-16 text-gray-600">🍺</div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 z-20 p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                {product.name}
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-300 backdrop-blur-sm">
                {product.category}
              </span>
            </div>
            <span className="text-2xl font-bold text-blue-400">
              ${product.price.toLocaleString()}
            </span>
          </div>
          {product.description && (
            <p className="text-sm text-gray-300 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center gap-4 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/80 hover:bg-blue-500 backdrop-blur-sm text-white text-sm font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star size={16} />
              <span>Destacado</span>
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm text-white text-sm font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Info size={16} />
              <span>Detalles</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};