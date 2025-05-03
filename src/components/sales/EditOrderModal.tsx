import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Sale, Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale;
  product: Product;
  onSave: (updatedSale: Sale) => Promise<void>;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  isOpen,
  onClose,
  sale,
  product,
  onSave,
}) => {
  const [quantity, setQuantity] = useState(sale.quantity.toString());
  const [paymentMethod, setPaymentMethod] = useState(sale.paymentMethod);
  const [tableNumber, setTableNumber] = useState(sale.tableNumber || '');
  const [isFriendPrice, setIsFriendPrice] = useState(false);
  const [friendPrice, setFriendPrice] = useState(product.price.toString());

  useEffect(() => {
    // Check if current price differs from product price to detect friend price
    const currentUnitPrice = sale.totalPrice / sale.quantity;
    setIsFriendPrice(currentUnitPrice !== product.price);
    setFriendPrice(currentUnitPrice.toString());
  }, [sale, product.price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const quantityNum = Number(quantity);
    if (product.quantity !== null && quantityNum > product.quantity) {
      alert('No hay suficiente stock para esta venta.');
      return;
    }

    const finalPrice = isFriendPrice ? Number(friendPrice) : product.price;
    const updatedSale: Sale = {
      ...sale,
      quantity: quantityNum,
      totalPrice: finalPrice * quantityNum,
      paymentMethod,
      tableNumber: tableNumber || undefined,
    };

    await onSave(updatedSale);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Editar Pedido</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.category}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mesa/Referencia
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Ej: Mesa 1, Barra, etc."
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'efectivo' | 'nequi' | 'datafono')}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
              required
            >
              <option value="efectivo">Efectivo</option>
              <option value="nequi">Nequi</option>
              <option value="datafono">Datáfono</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isFriendPrice}
                onChange={(e) => {
                  setIsFriendPrice(e.target.checked);
                  if (!e.target.checked) setFriendPrice(product.price.toString());
                }}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Precio Amigos</span>
            </label>
            
            {isFriendPrice && (
              <input
                type="number"
                step="0.01"
                min="0"
                value={friendPrice}
                onChange={(e) => setFriendPrice(e.target.value)}
                placeholder="Ingrese el precio especial"
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
                required
              />
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(
                  Number(quantity) * (isFriendPrice ? Number(friendPrice) : product.price)
                )}
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={20} />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};