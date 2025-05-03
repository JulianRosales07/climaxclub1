import React from 'react';
import { Hero } from './Hero';
import { Gallery } from './Gallery';
import { Features } from './Features';
import { VideoSection } from './VideoSection';
import { Contact } from './Contact';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-gray-900">
      <Hero />
      <Gallery />
      <Features />
      <VideoSection />
      <Contact />
    </div>
  );
};