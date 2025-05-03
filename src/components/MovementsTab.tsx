import React, { useState } from 'react';
import { ArrowUpRight, Package, RotateCcw, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { InventoryMovement } from '../types';

export const MovementsTab: React.FC = () => {
  const { products, movements, addMovement, updateMovement, deleteMovement } = useStore();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    type: 'prestamo' as const,
    notes: '',
    receivedFrom: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const movement: Omit<InventoryMovement, 'id' | 'date'> = {
      productId: formData.productId,
      quantity: Number(formData.quantity),
      type: formData.type,
      notes: formData.notes || undefined,
      status: formData.type === 'recepcion' ? 'returned' : 'pending',
      receivedFrom: formData.type === 'recepcion' ? formData.receivedFrom : undefined,
    };

    await addMovement(movement);
    setFormData({
      productId: '',
      quantity: '',
      type: 'prestamo',
      notes: '',
      receivedFrom: '',
    });
  };

  const handleReturn = async (movement: InventoryMovement) => {
    if (window.confirm('¿Está seguro de que desea marcar este movimiento como retornado?')) {
      await updateMovement({
        ...movement,
        status: 'returned',
        returnDate: new Date().toISOString(),
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este movimiento?')) {
      await deleteMovement(id);
    }
  };

  const pendingMovements = movements.filter(m => m.status === 'pending');
  const completedMovements = movements.filter(m => m.status === 'returned');

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name ?? 'Producto no encontrado';
  };

  const renderMovementIcon = (type: string) => {
    switch (type) {
      case 'prestamo':
        return <ArrowUpRight size={20} className="text-orange-500" />;
      case 'recepcion':
        return <Package size={20} className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Registrar Movimiento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
                required
              >
                <option value="">Seleccionar producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimiento</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'prestamo' | 'recepcion' })}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
                required
              >
                <option value="prestamo">Préstamo</option>
                <option value="recepcion">Recepción de Productos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
                required
              />
            </div>

            {formData.type === 'recepcion' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recibido de</label>
                <input
                  type="text"
                  value={formData.receivedFrom}
                  onChange={(e) => setFormData({ ...formData, receivedFrom: e.target.value })}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
                  placeholder="Nombre del proveedor"
                  required={formData.type === 'recepcion'}
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
                placeholder="Detalles adicionales"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrar Movimiento
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-lg font-bold mb-4">Movimientos Pendientes</h3>
          <div className="space-y-4">
            {pendingMovements.map((movement) => (
              <div key={movement.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {renderMovementIcon(movement.type)}
                    <h4 className="font-medium">{getProductName(movement.productId)}</h4>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{movement.quantity} unidades</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(movement.date), "d 'de' MMMM, HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>
                {movement.notes && (
                  <p className="text-sm text-gray-600 mb-2">{movement.notes}</p>
                )}
                {movement.type === 'recepcion' && movement.receivedFrom && (
                  <p className="text-sm text-gray-600 mb-2">
                    Recibido de: {movement.receivedFrom}
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleReturn(movement)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <RotateCcw size={16} />
                    <span>Retornado</span>
                  </button>
                  <button
                    onClick={() => handleDelete(movement.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
            {pendingMovements.length === 0 && (
              <p className="text-center text-gray-500">No hay movimientos pendientes</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-lg font-bold mb-4">Movimientos Completados</h3>
          <div className="space-y-4">
            {completedMovements.map((movement) => (
              <div key={movement.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {renderMovementIcon(movement.type)}
                    <h4 className="font-medium">{getProductName(movement.productId)}</h4>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{movement.quantity} unidades</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(movement.date), "d 'de' MMMM, HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>
                {movement.notes && (
                  <p className="text-sm text-gray-600 mb-2">{movement.notes}</p>
                )}
                {movement.type === 'recepcion' && movement.receivedFrom && (
                  <p className="text-sm text-gray-600 mb-2">
                    Recibido de: {movement.receivedFrom}
                  </p>
                )}
                {movement.returnDate && (
                  <p className="text-sm text-green-600">
                    Retornado: {format(new Date(movement.returnDate), "d 'de' MMMM, HH:mm", { locale: es })}
                  </p>
                )}
              </div>
            ))}
            {completedMovements.length === 0 && (
              <p className="text-center text-gray-500">No hay movimientos completados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};