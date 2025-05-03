import React, { useState } from 'react';
import { DollarSign, Calculator, Save } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface CashReconciliationProps {
  totalSalesByMethod: Record<string, number>;
  onSaveReconciliation: (data: ReconciliationData) => void;
}

export interface ReconciliationData {
  expectedCash: number;
  actualCash: number;
  difference: number;
  nequiTotal: number;
  cardTotal: number;
  notes?: string;
  timestamp: string;
}

export const CashReconciliation: React.FC<CashReconciliationProps> = ({
  totalSalesByMethod,
  onSaveReconciliation,
}) => {
  const [actualCash, setActualCash] = useState('');
  const [notes, setNotes] = useState('');
  const [showReconciliation, setShowReconciliation] = useState(false);

  const expectedCash = totalSalesByMethod.efectivo || 0;
  const nequiTotal = totalSalesByMethod.nequi || 0;
  const cardTotal = totalSalesByMethod.datafono || 0;

  const difference = Number(actualCash) - expectedCash;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reconciliationData: ReconciliationData = {
      expectedCash,
      actualCash: Number(actualCash),
      difference,
      nequiTotal,
      cardTotal,
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString(),
    };

    onSaveReconciliation(reconciliationData);
    toast.success('Cuadre de caja guardado exitosamente');
    setShowReconciliation(false);
    setActualCash('');
    setNotes('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <DollarSign className="text-green-600" />
          Cuadre de Caja
        </h2>
        <button
          onClick={() => setShowReconciliation(!showReconciliation)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Calculator size={20} />
          <span>Realizar Cuadre</span>
        </button>
      </div>

      {showReconciliation && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Efectivo Esperado</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(expectedCash)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Nequi</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(nequiTotal)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Datáfono</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(cardTotal)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Efectivo Real en Caja
              </label>
              <input
                type="number"
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            {actualCash && (
              <div className={`p-4 rounded-lg ${
                difference === 0 ? 'bg-green-50' :
                difference > 0 ? 'bg-blue-50' : 'bg-red-50'
              }`}>
                <h3 className="font-medium mb-1">Diferencia</h3>
                <p className={`text-xl font-bold ${
                  difference === 0 ? 'text-green-600' :
                  difference > 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {formatCurrency(Math.abs(difference))}
                  {difference !== 0 && (
                    <span className="text-sm font-normal ml-2">
                      ({difference > 0 ? 'Sobrante' : 'Faltante'})
                    </span>
                  )}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                rows={3}
                placeholder="Agregar notas o comentarios sobre el cuadre..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowReconciliation(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={20} />
              <span>Guardar Cuadre</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};