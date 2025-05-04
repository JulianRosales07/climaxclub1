import React, { useState } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Sale } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface SalesClosurePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  sales: Sale[];
  totalSales: number;
  totalSalesByMethod: Record<string, number>;
  getProductName: (id: string) => string;
}

export const SalesClosurePreview: React.FC<SalesClosurePreviewProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sales,
  totalSales,
  totalSalesByMethod,
  getProductName,
}) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error al cerrar las ventas:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
        <div className="p-4 border-b flex justify-between items-center bg-yellow-50">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold">Cerrar Ventas del Día</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-yellow-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Resumen de Ventas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800">Total</h4>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(totalSales)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-green-800">Efectivo</h4>
                <p className="text-lg font-bold text-green-600">{formatCurrency(totalSalesByMethod.efectivo)}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800">Nequi</h4>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(totalSalesByMethod.nequi)}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-orange-800">Datáfono</h4>
                <p className="text-lg font-bold text-orange-600">{formatCurrency(totalSalesByMethod.datafono)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                rows={3}
                placeholder="Agregar notas o comentarios sobre el cierre..."
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800">
              <p className="font-medium">¡Atención!</p>
              <p className="text-sm mt-1">
                Al cerrar las ventas del día:
              </p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                <li>Se generará un reporte con todas las ventas pagadas del día</li>
                <li>Las ventas actuales se archivarán</li>
                <li>Se iniciará un nuevo día de ventas</li>
              </ul>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{getProductName(sale.productId)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{sale.quantity}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatCurrency(sale.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            <Check size={20} />
            <span>{isSubmitting ? 'Procesando...' : 'Confirmar Cierre'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};