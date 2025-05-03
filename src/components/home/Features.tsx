import React from 'react';
import { Music, Users, Gift, Star } from 'lucide-react';

const features = [
  {
    icon: <Music className="w-12 h-12 text-blue-400" />,
    title: 'Música en Vivo',
    description: 'Disfruta de las mejores bandas locales todos los fines de semana'
  },
  {
    icon: <Users className="w-12 h-12 text-blue-400" />,
    title: 'Eventos Privados',
    description: 'Organiza tus celebraciones especiales con nosotros'
  },
  {
    icon: <Gift className="w-12 h-12 text-blue-400" />,
    title: 'Happy Hour',
    description: 'Promociones especiales de 6:00 PM a 8:00 PM'
  },
  {
    icon: <Star className="w-12 h-12 text-blue-400" />,
    title: 'VIP Experience',
    description: 'Servicio personalizado y áreas exclusivas'
  }
];

export const Features: React.FC = () => {
  return (
    <div id="features" className="bg-gray-800 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Lo Que Nos Hace Únicos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};