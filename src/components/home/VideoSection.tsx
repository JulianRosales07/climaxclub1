import React from 'react';
import { VideoPlayer } from './VideoPlayer';

export const VideoSection: React.FC = () => {
  return (
    <div className="bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Vive la Experiencia
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <VideoPlayer 
              src="/videos/background.mp4"
              className="aspect-video"
            />
          </div>
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Ambiente</h3>
              <p className="text-gray-400 text-sm">Disfruta de nuestro ambiente único y exclusivo</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Música</h3>
              <p className="text-gray-400 text-sm">Los mejores DJs y música en vivo</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Shows</h3>
              <p className="text-gray-400 text-sm">Espectáculos y eventos especiales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};