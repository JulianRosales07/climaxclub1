import React from 'react';
import { X, FileDown, Trash2 } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Sale } from '../../types';
import toast from 'react-hot-toast';

interface SalesSummaryPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  sales: Sale[];
  totalSales: number;
  totalSalesByMethod: Record<string, number>;
  getProductName: (id: string) => string;
  getProductCategory: (id: string) => string;
  todaysTopProducts: Array<{ productId: string; quantity: number; totalSales: number; }>;
  onDeleteSale: (saleId: string) => void;
}

export const SalesSummaryPreview: React.FC<SalesSummaryPreviewProps> = ({
  isOpen,
  onClose,
  onExport,
  sales,
  totalSales,
  totalSalesByMethod,
  getProductName,
  getProductCategory,
  todaysTopProducts,
  onDeleteSale,
}) => {
  if (!isOpen) return null;

  const handleExport = () => {
    try {
      onExport();
      toast.success('Reporte exportado exitosamente');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Error al exportar el reporte');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Resumen de Ventas</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {/* Resumen General */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Ventas</h3>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalSales)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Efectivo</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSalesByMethod.efectivo)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Nequi</h3>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalSalesByMethod.nequi)}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Datáfono</h3>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalSalesByMethod.datafono)}</p>
            </div>
          </div>

          {/* Top Productos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Top Productos del Día</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                {todaysTopProducts.map((item, index) => (
                  <div key={item.productId} className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-500">#{index + 1}</span>
                      <span>{getProductName(item.productId)}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.quantity} unidades</div>
                      <div className="text-sm text-gray-600">{formatCurrency(item.totalSales)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detalle de Ventas */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Detalle de Ventas</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(sale.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getProductName(sale.productId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getProductCategory(sale.productId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {sale.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(sale.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => onDeleteSale(sale.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FileDown size={20} />
            <span>Exportar a Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
};