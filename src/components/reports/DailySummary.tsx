import React, { useState } from 'react';
import { FileDown, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { Sale } from '../../types';
import { SalesSummaryPreview } from './SalesSummaryPreview';
import { SalesClosurePreview } from './SalesClosurePreview';
import { ReconciliationData } from './CashReconciliation';

interface DailySummaryProps {
  sales: Sale[];
  totalSales: number;
  totalSalesByMethod: Record<string, number>;
  getProductName: (id: string) => string;
  getProductCategory: (id: string) => string;
  handleCloseSales: ((data: ReconciliationData) => Promise<void>) | undefined;
  todaysTopProducts: Array<{ productId: string; quantity: number; totalSales: number; }>;
}

export const DailySummary: React.FC<DailySummaryProps> = ({
  sales,
  totalSales,
  totalSalesByMethod,
  getProductName,
  getProductCategory,
  handleCloseSales,
  todaysTopProducts,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showClosurePreview, setShowClosurePreview] = useState(false);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Ventas detalladas
    const salesData = sales.map(sale => ({
      'Fecha': format(new Date(sale.date), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es }),
      'Producto': getProductName(sale.productId),
      'Categoría': getProductCategory(sale.productId),
      'Cantidad': sale.quantity,
      'Método de Pago': sale.paymentMethod,
      'Total': `$${sale.totalPrice.toFixed(2)}`,
    }));
    
    const ws = XLSX.utils.json_to_sheet(salesData);
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');

    // Top productos del día
    const topProductsData = todaysTopProducts.map(item => ({
      'Producto': getProductName(item.productId),
      'Cantidad': item.quantity,
      'Total': `$${item.totalSales.toFixed(2)}`,
    }));
    
    const wsTop = XLSX.utils.json_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(wb, wsTop, 'Top Productos');

    const fileName = `reporte-ventas-${format(new Date(), 'yyyy-MM-dd-HHmm')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    setShowPreview(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Resumen de Ventas</h2>
        <div className="flex flex-wrap gap-2">
          {handleCloseSales && (
            <button
              onClick={() => setShowClosurePreview(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle size={20} />
              <span>Cerrar Ventas del Día</span>
            </button>
          )}
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileDown size={20} />
            <span>Ver Resumen</span>
          </button>
        </div>
      </div>

      <SalesSummaryPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onExport={exportToExcel}
        sales={sales}
        totalSales={totalSales}
        totalSalesByMethod={totalSalesByMethod}
        getProductName={getProductName}
        getProductCategory={getProductCategory}
        todaysTopProducts={todaysTopProducts}
      />

      {handleCloseSales && (
        <SalesClosurePreview
          isOpen={showClosurePreview}
          onClose={() => setShowClosurePreview(false)}
          onConfirm={handleCloseSales}
          sales={sales}
          totalSales={totalSales}
          totalSalesByMethod={totalSalesByMethod}
          getProductName={getProductName}
        />
      )}
    </>
  );
};