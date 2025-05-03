import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { TrendingUp } from 'lucide-react';
import { DailySummary } from './reports/DailySummary';
import { SalesHistory } from './reports/SalesHistory';
import { PaymentMethodDetails } from './reports/PaymentMethodDetails';
import toast from 'react-hot-toast';

interface ReportsTabProps {
  canModify: boolean;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ canModify }) => {
  const { products, sales, loadProducts, loadSales, addReport, resetSales } = useStore();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name ?? 'Producto eliminado';
  };

  const getProductCategory = (productId: string) => {
    return products.find((p) => p.id === productId)?.category ?? 'N/A';
  };

  const totalSales = sales.reduce((acc, sale) => acc + sale.totalPrice, 0);
  const totalSalesByMethod = sales.reduce(
    (acc, sale) => {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.totalPrice;
      return acc;
    },
    { efectivo: 0, nequi: 0, datafono: 0 } as Record<string, number>
  );

  const todaysSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });

  const todaysTopProducts = Object.entries(
    todaysSales.reduce((acc, sale) => {
      if (!acc[sale.productId]) {
        acc[sale.productId] = { quantity: 0, totalSales: 0 };
      }
      acc[sale.productId].quantity += sale.quantity;
      acc[sale.productId].totalSales += sale.totalPrice;
      return acc;
    }, {} as Record<string, { quantity: number; totalSales: number }>)
  )
    .map(([productId, data]) => ({
      productId,
      quantity: data.quantity,
      totalSales: data.totalSales,
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);

  const handleCloseSales = async () => {
    try {
      if (sales.length === 0) {
        toast.error('No hay ventas para generar el reporte');
        return;
      }

      const newReport = {
        date: new Date().toISOString(),
        sales: sales.map(sale => ({
          ...sale,
          totalPrice: Number(sale.totalPrice),
          quantity: Number(sale.quantity)
        })),
        totalAmount: Number(totalSales),
        topProducts: todaysTopProducts.map(product => ({
          ...product,
          quantity: Number(product.quantity),
          totalSales: Number(product.totalSales)
        }))
      };

      await addReport(newReport);
      await resetSales(); // Reset sales after generating report
      await loadSales(); // Reload sales to reflect the reset
      await loadProducts();
      
      toast.success('Ventas del día cerradas exitosamente');
    } catch (error) {
      console.error('Error closing sales:', error);
      toast.error('Error al cerrar las ventas del día');
    }
  };

  const salesByMethod = useMemo(() => ({
    efectivo: sales.filter(sale => sale.paymentMethod === 'efectivo'),
    nequi: sales.filter(sale => sale.paymentMethod === 'nequi'),
    datafono: sales.filter(sale => sale.paymentMethod === 'datafono'),
  }), [sales]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <DailySummary
          sales={sales}
          totalSales={totalSales}
          totalSalesByMethod={totalSalesByMethod}
          getProductName={getProductName}
          getProductCategory={getProductCategory}
          handleCloseSales={canModify ? handleCloseSales : undefined}
          todaysTopProducts={todaysTopProducts}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Ventas</h3>
            <p className="text-2xl font-bold text-blue-600">${totalSales.toLocaleString()}</p>
          </div>
          <div 
            className="bg-green-50 p-4 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
            onClick={() => setSelectedPaymentMethod('efectivo')}
          >
            <h3 className="text-lg font-semibold text-green-800 mb-2">Efectivo</h3>
            <p className="text-2xl font-bold text-green-600">${totalSalesByMethod.efectivo.toLocaleString()}</p>
          </div>
          <div 
            className="bg-purple-50 p-4 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => setSelectedPaymentMethod('nequi')}
          >
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Nequi</h3>
            <p className="text-2xl font-bold text-purple-600">${totalSalesByMethod.nequi.toLocaleString()}</p>
          </div>
          <div 
            className="bg-orange-50 p-4 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
            onClick={() => setSelectedPaymentMethod('datafono')}
          >
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Datáfono</h3>
            <p className="text-2xl font-bold text-orange-600">${totalSalesByMethod.datafono.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {canModify && <SalesHistory getProductName={getProductName} />}

      {selectedPaymentMethod && (
        <PaymentMethodDetails
          isOpen={true}
          onClose={() => setSelectedPaymentMethod(null)}
          paymentMethod={selectedPaymentMethod}
          sales={salesByMethod[selectedPaymentMethod as keyof typeof salesByMethod]}
          getProductName={getProductName}
        />
      )}
    </div>
  );
};