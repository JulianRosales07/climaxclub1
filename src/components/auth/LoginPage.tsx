import React, { useState } from 'react';
import { LogIn, User, Wine } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { AdminLoginModal } from './AdminLoginModal';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleClientLogin = async () => {
    await login();
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Admin Login Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowAdminModal(true)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <LogIn size={20} />
          <span>Acceso Empleados</span>
        </button>
      </div>

      {/* Client Login Section */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Wine className="w-24 h-24 text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            CLIMAX
          </h1>
          <p className="text-xl text-gray-400">Sistema de Gestión de Bar</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <button
            onClick={handleClientLogin}
            className="group relative px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center gap-3"
          >
            <User size={24} />
            <span className="text-xl font-medium">Ingresar como Cliente</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 text-center text-gray-500"
        >
          <p>Horario de Atención</p>
          <p>Martes a Jueves: 6:00 PM - 1:00 AM</p>
          <p>Viernes y Sábado: 6:00 PM - 2:00 AM</p>
        </motion.div>
      </div>

      <AdminLoginModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
};