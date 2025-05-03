import React from 'react';
import { Product } from '../../types';

interface SalesFormProps {
  tableNumber: string;
  setTableNumber: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  paymentMethod: 'efectivo' | 'nequi' | 'datafono';
  setPaymentMethod: (value: 'efectivo' | 'nequi' | 'datafono') => void;
  isFriendPrice: boolean;
  setIsFriendPrice: (value: boolean) => void;
  friendPrice: string;
  setFriendPrice: (value: string) => void;
  selectedProduct: Product | null;
}

export const SalesForm: React.FC<SalesFormProps> = ({
  tableNumber,
  setTableNumber,
  quantity,
  setQuantity,
  paymentMethod,
  setPaymentMethod,
  isFriendPrice,
  setIsFriendPrice,
  friendPrice,
  setFriendPrice,
  selectedProduct,
}) => {
  return (
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

      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div className="flex items-center gap-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isFriendPrice}
            onChange={(e) => {
              setIsFriendPrice(e.target.checked);
              if (!e.target.checked) setFriendPrice('');
            }}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">Precio Amigos</span>
        </label>
        
        {isFriendPrice && (
          <div className="flex-1">
            <input
              type="number"
              step="0.01"
              min="0"
              value={friendPrice}
              onChange={(e) => setFriendPrice(e.target.value)}
              placeholder="Ingrese el precio especial"
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
              required={isFriendPrice}
            />
          </div>
        )}
      </div>
    </div>
  );
};