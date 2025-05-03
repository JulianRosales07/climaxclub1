import React, { useState } from 'react';
import { Wine, Clock, MapPin, Phone, ChevronDown, Menu, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isHoveredMenu, setIsHoveredMenu] = useState(false);
  const [isHoveredSong, setIsHoveredSong] = useState(false);

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewMenu = () => {
    if (!user) {
      useAuthStore.getState().login().then(() => {
        navigate('/products');
      });
    } else {
      navigate('/products');
    }
  };

  const handleRequestSong = () => {
    if (!user) {
      useAuthStore.getState().login().then(() => {
        navigate('/songs');
      });
    } else {
      navigate('/songs');
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 z-10" />
      
      <div className="relative z-20 container mx-auto px-4 py-20 min-h-screen flex flex-col justify-center items-center text-white text-center">
        <div className="animate-fadeIn">
          <Wine size={64} className="mx-auto mb-6 animate-bounce text-blue-400" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            CLIMAX
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Tu destino para una experiencia única en bebidas y cócteles
          </p>

          {(!user || user.role === 'client') && (
            <AnimatePresence>
              <div className="flex flex-col gap-4">
                <motion.button
                  onClick={handleViewMenu}
                  onHoverStart={() => setIsHoveredMenu(true)}
                  onHoverEnd={() => setIsHoveredMenu(false)}
                  className="relative px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center gap-3 mx-auto overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600"
                    initial={{ x: '-100%' }}
                    animate={{ x: isHoveredMenu ? '0%' : '-100%' }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <motion.div
                    className="relative flex items-center gap-3"
                    animate={{ x: isHoveredMenu ? [0, -4, 4, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Menu className="w-6 h-6" />
                    <span className="text-lg font-medium">Ver Nuestra Carta</span>
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    animate={{ scale: isHoveredMenu ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm" />
                  </motion.div>
                </motion.button>

                <motion.button
                  onClick={handleRequestSong}
                  onHoverStart={() => setIsHoveredSong(true)}
                  onHoverEnd={() => setIsHoveredSong(false)}
                  className="relative px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center gap-3 mx-auto overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600"
                    initial={{ x: '-100%' }}
                    animate={{ x: isHoveredSong ? '0%' : '-100%' }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <motion.div
                    className="relative flex items-center gap-3"
                    animate={{ x: isHoveredSong ? [0, -4, 4, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Music className="w-6 h-6" />
                    <span className="text-lg font-medium">Pedir Canción</span>
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    animate={{ scale: isHoveredSong ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm" />
                  </motion.div>
                </motion.button>
              </div>
            </AnimatePresence>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-4xl mx-auto animate-slideIn">
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-black bg-opacity-50 p-6 rounded-lg backdrop-blur-sm hover:bg-opacity-70 transition-all duration-300 group"
          >
            <Clock className="mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-lg font-semibold mb-2">Horario</h3>
            <p>Martes - Jueves</p>
            <p>6:00 PM - 1:00 AM</p>
            <p>Viernes - Sábado</p>
            <p>6:00 PM - 2:00 AM</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className="bg-black bg-opacity-50 p-6 rounded-lg backdrop-blur-sm hover:bg-opacity-70 transition-all duration-300 group"
          >
            <MapPin className="mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-lg font-semibold mb-2">Ubicación</h3>
            <p>Cra 36 # 18 - 30, Palermo.</p>
            <p>Pasto, Nariño</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className="bg-black bg-opacity-50 p-6 rounded-lg backdrop-blur-sm hover:bg-opacity-70 transition-all duration-300 group"
          >
            <Phone className="mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-lg font-semibold mb-2">Reservas</h3>
            <p>+57 315 396 7964</p>
          </motion.div>
        </div>

        <motion.button
          onClick={scrollToFeatures}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:text-blue-400 transition-colors"
          whileHover={{ y: [0, -4, 4, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          aria-label="Scroll to features"
        >
          <ChevronDown size={32} />
        </motion.button>
      </div>
    </div>
  );
};
