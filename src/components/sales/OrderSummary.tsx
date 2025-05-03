import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface OrderSummaryProps {
  selectedProduct: Product | null;
  quantity: string;
  paymentMethod: 'efectivo' | 'nequi' | 'datafono';
  isFriendPrice: boolean;
  friendPrice: string;
  tableNumber: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedProduct,
  quantity,
  paymentMethod,
  isFriendPrice,
  friendPrice,
  tableNumber,
}) => {
  if (!selectedProduct) return null;

  const quantityNum = Number(quantity);
  const finalPrice = isFriendPrice ? Number(friendPrice) : selectedProduct.price;
  const total = quantityNum * finalPrice;

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <h3 className="text-lg font-medium text-gray-900">
        Resumen del Pedido
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-500">Producto</span>
          <p className="font-medium">{selectedProduct.name}</p>
        </div>
        
        <div>
          <span className="text-sm text-gray-500">Categoría</span>
          <p className="font-medium">{selectedProduct.category}</p>
        </div>

        {selectedProduct.quantity !== null && (
          <div>
            <span className="text-sm text-gray-500">Stock Disponible</span>
            <p className="font-medium">{selectedProduct.quantity}</p>
          </div>
        )}

        <div>
          <span className="text-sm text-gray-500">Cantidad</span>
          <p className="font-medium">{quantity || '-'}</p>
        </div>

        <div>
          <span className="text-sm text-gray-500">Método de Pago</span>
          <p className="font-medium capitalize">{paymentMethod}</p>
        </div>

        {tableNumber && (
          <div>
            <span className="text-sm text-gray-500">Mesa/Referencia</span>
            <p className="font-medium">{tableNumber}</p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">Precio Unitario</span>
          <div className="text-right">
            {isFriendPrice ? (
              <>
                <span className="line-through text-sm text-gray-400 mr-2">
                  {formatCurrency(selectedProduct.price)}
                </span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(Number(friendPrice))}
                </span>
              </>
            ) : (
              <span className="font-medium">
                {formatCurrency(selectedProduct.price)}
              </span>
            )}
          </div>
        </div>

        {quantity && (
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-lg font-medium">Total</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(total)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};