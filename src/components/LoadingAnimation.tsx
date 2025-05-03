import React from 'react';
import { Wine } from 'lucide-react';

export const LoadingAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-24 h-32 mx-auto mb-4">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20">
            <Wine className="w-20 h-20 text-white animate-pulse" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 animate-pour">
            <div className="w-1 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 overflow-hidden">
            <div className="bubble-1" />
            <div className="bubble-2" />
            <div className="bubble-3" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">
          CLIMAX
        </h2>
        <p className="text-blue-400 animate-pulse">Preparando tu experiencia...</p>
        <div className="mt-4 flex justify-center gap-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};