import React, { useState, useEffect, useMemo } from 'react';
import { Beer, Search, Wine, FileLock as Cocktail, Coffee, Star, Info } from 'lucide-react';
import { Product } from '../types';
import productsData from '../db.json';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientViewProps {
  products?: Product[];
}

const ProductModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl shadow-xl relative text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          ✕
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full md:w-1/2 h-64 object-cover rounded-xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
            }}
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <span className="inline-block mb-4 px-3 py-1 text-sm bg-blue-800 text-blue-200 rounded-full">
              {product.category}
            </span>
            <p className="text-gray-300 mb-4">{product.description}</p>
            <p className="text-xl text-blue-400 font-bold">
              Precio: ${product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ClientView: React.FC<ClientViewProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);
      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else {
        throw new Error('Products data is not in the expected format');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(product => product.category)));
    return ['all', ...uniqueCategories];
  }, [products]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'licores':
        return <Wine className="w-6 h-6" />;
      case 'cócteles':
        return <Cocktail className="w-6 h-6" />;
      case 'cervezas':
        return <Beer className="w-6 h-6" />;
      default:
        return <Coffee className="w-6 h-6" />;
    }
  };

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Mostrar productos destacados primero
    const featured = filtered.filter(product => product.featured);
    const nonFeatured = filtered.filter(product => !product.featured);
    return [...featured, ...nonFeatured];
  }, [products, searchTerm, selectedCategory]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Search Bar */}
      <div className="sticky top-0 bg-gray-900/80 backdrop-blur-lg z-20 p-4 border-b border-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Dropdown with icons */}
          <div className="block lg:hidden mb-4">
            <div className="relative">
              <select
                className="w-full px-4 py-3 pr-10 bg-gray-800 text-white rounded-xl border border-gray-700 appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Todos' : category}
                  </option>
                ))}
              </select>
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-white">
              {getCategoryIcon(selectedCategory)}
              <span className="capitalize font-medium">
                {selectedCategory === 'all' ? 'Todos' : selectedCategory}
              </span>
            </div>
          </div>

          {/* Categories Sidebar (Desktop) */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-2">
              {categories.map(category => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {getCategoryIcon(category)}
                  <span className="font-medium capitalize">
                    {category === 'all' ? 'Todos' : category}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${selectedProduct?.id === product.id
                      ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                      : ''
                      }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                        <Beer className="w-16 h-16 text-gray-600" />
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                            }}
                          >
                            <Info size={16} />
                            <span>Detalles</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Beer className="mx-auto h-16 w-16 text-gray-600" />
                <h3 className="mt-4 text-xl font-medium text-white">No se encontraron productos</h3>
                <p className="mt-2 text-gray-400">
                  Intenta con otros términos de búsqueda o categoría
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};