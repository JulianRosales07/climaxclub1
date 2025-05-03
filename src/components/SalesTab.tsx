import React, { useState } from 'react';
import { ShoppingCart, DollarSign, Plus, Edit2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Sale, Product } from '../types';
import { ProductSelectionModal } from './sales/ProductSelectionModal';
import { EditOrderModal } from './sales/EditOrderModal';
import { formatCurrency } from '../utils/formatters';

export const SalesTab: React.FC = () => {
  const { products, addSale, sales, updateSale } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'nequi' | 'datafono'>('efectivo');
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    product: Product;
    quantity: number;
    isFriendPrice?: boolean;
    friendPrice?: number;
  }>>([]);

  const pendingSales = sales.filter(sale => sale.status === 'pending');

  const handleProductSelection = (selections: Array<{ product: Product; quantity: number }>) => {
    setSelectedProducts(selections.map(selection => ({
      ...selection,
      isFriendPrice: false,
    })));
  };

  const handleFriendPriceChange = (productId: string, isFriendPrice: boolean) => {
    setSelectedProducts(prev => prev.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          isFriendPrice,
          friendPrice: isFriendPrice ? item.product.price : undefined,
        };
      }
      return item;
    }));
  };

  const handleFriendPriceUpdate = (productId: string, price: number) => {
    setSelectedProducts(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, friendPrice: price };
      }
      return item;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    for (const item of selectedProducts) {
      if (item.product.quantity !== null && item.quantity > item.product.quantity) {
        alert(`No hay suficiente stock para ${item.product.name}`);
        return;
      }

      const finalPrice = item.isFriendPrice && item.friendPrice
        ? item.friendPrice
        : item.product.price;

      await addSale({
        productId: item.product.id,
        quantity: item.quantity,
        totalPrice: finalPrice * item.quantity,
        paymentMethod,
        status: 'pending',
        tableNumber: tableNumber || undefined,
      });
    }

    setSelectedProducts([]);
    setTableNumber('');
    setPaymentMethod('efectivo');
  };

  const handleMarkAsPaid = async (sale: Sale) => {
    await updateSale({ ...sale, status: 'paid' });
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
  };

  const handleSaveEdit = async (updatedSale: Sale) => {
    await updateSale(updatedSale);
    setEditingSale(null);
  };

  const totalAmount = selectedProducts.reduce((sum, item) => {
    const price = item.isFriendPrice && item.friendPrice
      ? item.friendPrice
      : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de nuevo pedido */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Nuevo Pedido</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Agregar Productos</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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
            </div>

            {selectedProducts.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Productos Seleccionados</h3>
                <div className="divide-y">
                  {selectedProducts.map((item) => (
                    <div key={item.product.id} className="py-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            {formatCurrency(
                              (item.isFriendPrice && item.friendPrice
                                ? item.friendPrice
                                : item.product.price) * item.quantity
                            )}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="checkbox"
                              checked={item.isFriendPrice}
                              onChange={(e) => handleFriendPriceChange(item.product.id, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="text-sm text-gray-600">Precio Amigo</span>
                          </div>
                          {item.isFriendPrice && (
                            <input
                              type="number"
                              value={item.friendPrice}
                              onChange={(e) => handleFriendPriceUpdate(item.product.id, Number(e.target.value))}
                              className="mt-1 w-24 text-right rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 text-sm"
                              placeholder="Precio"
                              required
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCart size={20} />
                    <span>Registrar Pedido</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Lista de pedidos pendientes */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Pedidos Pendientes</h2>
          <div className="space-y-4">
            {pendingSales.map((sale) => {
              const product = products.find(p => p.id === sale.productId);
              if (!product) return null;
              
              return (
                <div key={sale.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {sale.tableNumber && `Mesa: ${sale.tableNumber} - `}
                        Cantidad: {sale.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(sale.totalPrice)}</p>
                      <p className="text-sm text-gray-600 capitalize">{sale.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSale(sale)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit2 size={20} />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleMarkAsPaid(sale)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <DollarSign size={20} />
                      <span>Marcar como Pagado</span>
                    </button>
                  </div>
                </div>
              );
            })}
            {pendingSales.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay pedidos pendientes</p>
            )}
          </div>
        </div>
      </div>

      <ProductSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
        onConfirm={handleProductSelection}
      />

      {editingSale && (
        <EditOrderModal
          isOpen={true}
          onClose={() => setEditingSale(null)}
          sale={editingSale}
          product={products.find(p => p.id === editingSale.productId)!}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};