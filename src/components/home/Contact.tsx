import React from 'react';
import {  MessageSquare, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Contáctanos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">

              
              <div className="flex items-center space-x-4">
                <MessageSquare className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white">WhatsApp</h3>
                  <p className="text-gray-400">+57 315 396 7964</p>
                </div>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Horario de Atención</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Martes - Jueves: 6:00 PM - 1:00 AM</li>
                  <li>Viernes: 6:00 PM - 2:00 AM</li>
                  <li>Sábado: 6:00 PM - 2:00 AM</li>
                </ul>
              </div>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-white mb-2">Nombre</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  placeholder="Tu nombre"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  placeholder="tu@email.com"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Mensaje</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-400 h-32"
                  placeholder="Tu mensaje"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Enviar Mensaje</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};