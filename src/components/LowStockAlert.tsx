import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Product } from '../types';

interface LowStockAlertProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center bg-yellow-50">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold">Alerta de Stock Bajo</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-yellow-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-3 bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Categoría: {product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-600">
                      Stock: {product.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Mínimo: {product.minStock}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Se recomienda reabastecer estos productos pronto para mantener un inventario óptimo.
          </p>
        </div>
      </div>
    </div>
  );
};