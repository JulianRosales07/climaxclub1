import React from 'react';
import { X, TrendingUp, AlertTriangle, Package } from 'lucide-react';
import { Product, DemandPrediction } from '../types';

interface DemandPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictions: Array<{ product: Product; prediction: DemandPrediction }>;
}

export const DemandPredictionModal: React.FC<DemandPredictionModalProps> = ({
  isOpen,
  onClose,
  predictions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="p-4 border-b flex justify-between items-center bg-blue-50">
          <div className="flex items-center gap-2 text-blue-800">
            <TrendingUp size={24} />
            <h2 className="text-xl font-bold">Predicción de Demanda</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {predictions.map(({ product, prediction }) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Categoría: {product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      Stock Actual: {product.quantity}
                    </p>
                    {product.minStock && (
                      <p className="text-sm text-gray-600">
                        Stock Mínimo: {product.minStock}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <TrendingUp size={18} />
                      <h4 className="font-medium">Demanda Predicha</h4>
                    </div>
                    <p className="text-2xl font-bold">
                      {prediction.predictedDemand.toFixed(1)}
                      <span className="text-sm font-normal text-gray-600"> unidades/día</span>
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full"
                          style={{ width: `${prediction.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {(prediction.confidence * 100).toFixed(0)}% confianza
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <Package size={18} />
                      <h4 className="font-medium">Orden Sugerida</h4>
                    </div>
                    <p className="text-2xl font-bold">
                      {prediction.suggestedOrder}
                      <span className="text-sm font-normal text-gray-600"> unidades</span>
                    </p>
                    {product.supplier && (
                      <p className="text-sm text-gray-600 mt-1">
                        Proveedor: {product.supplier}
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center gap-2 text-orange-600 mb-1">
                      <AlertTriangle size={18} />
                      <h4 className="font-medium">Tiempo de Entrega</h4>
                    </div>
                    <p className="text-2xl font-bold">
                      {product.leadTime || 7}
                      <span className="text-sm font-normal text-gray-600"> días</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tiempo promedio de reabastecimiento
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Las predicciones se basan en el historial de ventas de los últimos 30 días y se actualizan diariamente.
          </p>
        </div>
      </div>
    </div>
  );
};