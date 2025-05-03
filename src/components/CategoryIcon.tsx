import React from 'react';
import { Beer, Wine, FileLock as Cocktail, Coffee } from 'lucide-react';

interface CategoryIconProps {
  category: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
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