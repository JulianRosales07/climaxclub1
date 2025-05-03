import React from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Sale } from '../../types';

interface PaymentMethodDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: string;
  sales: Sale[];
  getProductName: (id: string) => string;
}

export const PaymentMethodDetails: React.FC<PaymentMethodDetailsProps> = ({
  isOpen,
  onClose,
  paymentMethod,
  sales,
  getProductName,
}) => {
  if (!isOpen) return null;

  const totalAmount = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold capitalize">
            Ventas por {paymentMethod}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{getProductName(sale.productId)}</h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(sale.date), "d 'de' MMMM 'de' yyyy, HH:mm", {
                        locale: es,
                      })}
                    </p>
                    {sale.tableNumber && (
                      <p className="text-sm text-gray-600">Mesa: {sale.tableNumber}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${sale.totalPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Cantidad: {sale.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};