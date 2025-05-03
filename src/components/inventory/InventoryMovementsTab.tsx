import React, { useState, useRef } from 'react';
import { InventoryContent } from './InventoryContent';
import { MovementsContent } from './MovementsContent';

interface InventoryMovementsTabProps {
  canModify: boolean;
}

export const InventoryMovementsTab: React.FC<InventoryMovementsTabProps> = ({ canModify }) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const movementsRef = useRef<HTMLDivElement>(null);
  const inventoryRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: 'inventory' | 'movements') => {
    const ref = section === 'inventory' ? inventoryRef : movementsRef;
    setActiveTab(section);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="sticky top-0 z-10 bg-gray-100 pt-2 pb-4">
        <div className="flex rounded-lg overflow-hidden bg-white shadow-md">
          <button
            onClick={() => scrollToSection('inventory')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Inventario
          </button>
          <button
            onClick={() => scrollToSection('movements')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'movements' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Movimientos
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div ref={inventoryRef} className="scroll-mt-24">
          <InventoryContent canModify={canModify} />
        </div>

        <div ref={movementsRef} className="scroll-mt-24">
          <MovementsContent canModify={canModify} />
        </div>
      </div>
    </div>
  );
};