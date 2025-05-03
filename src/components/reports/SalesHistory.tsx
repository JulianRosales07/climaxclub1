import React, { useEffect } from 'react';
import { History, Trash2 } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { SalesReport } from '../../types';
import { useStore } from '../../store/useStore';
import { useConfirmation } from '../../hooks/useConfirmation';
import { ConfirmationDialog } from '../ConfirmationDialog';
import toast from 'react-hot-toast';

interface SalesHistoryProps {
  getProductName: (id: string) => string;
}

export const SalesHistory: React.FC<SalesHistoryProps> = ({ getProductName }) => {
  const { reports, loadReports, deleteReport } = useStore();
  const {
    confirm,
    isOpen,
    options,
    handleConfirm,
    handleCancel,
  } = useConfirmation();

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleDelete = async (reportId: string, date: string) => {
    const confirmed = await confirm({
      title: 'Eliminar Reporte',
      message: `¿Está seguro de que desea eliminar el reporte del ${formatDate(date)}?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    });

    if (confirmed) {
      await deleteReport(reportId);
    }
  };

  if (!reports.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="text-center py-8 text-gray-500">
          No hay reportes disponibles
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
          <History size={24} className="text-blue-600" />
          Historial de Reportes Diarios
        </h2>
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Reporte del {formatDate(report.date)}
                  </h3>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(report.totalAmount)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(report.id, report.date)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Eliminar reporte"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Top Productos del Día</h4>
                  <div className="space-y-2">
                    {report.topProducts.map((item, index) => (
                      <div key={item.productId} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span>
                          {index + 1}. {getProductName(item.productId)}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{item.quantity} unidades</div>
                          <div className="text-sm text-gray-600">{formatCurrency(item.totalSales)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Detalles de Ventas</h4>
                  <div className="space-y-2">
                    {Object.entries(
                      report.sales.reduce((acc, sale) => {
                        if (!acc[sale.paymentMethod]) {
                          acc[sale.paymentMethod] = 0;
                        }
                        acc[sale.paymentMethod] += sale.totalPrice;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([method, amount]) => (
                      <div key={method} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="capitalize">{method}</span>
                        <span className="font-medium">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isOpen}
        title={options?.title || ''}
        message={options?.message || ''}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};