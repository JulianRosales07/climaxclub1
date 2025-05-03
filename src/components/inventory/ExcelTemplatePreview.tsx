import React from 'react';
import { X, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Category } from '../../types';

interface ExcelTemplatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories: Category[] = ['Licores', 'Cócteles', 'Granizados', 'Shots', 'Cervezas', 'Hervidos', 'Bebidas'];

const sampleData = [
  {
    Nombre: 'Ron Medellín',
    Categoria: 'Licores',
    Cantidad: 10,
    Precio: 15000,
  },
  {
    Nombre: 'Cerveza Águila',
    Categoria: 'Cervezas',
    Cantidad: 24,
    Precio: 5000,
  }
];

export const ExcelTemplatePreview: React.FC<ExcelTemplatePreviewProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
    XLSX.writeFile(wb, 'plantilla-productos.xlsx');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Plantilla de Excel - Estructura</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.Nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.Categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.Cantidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.Precio}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Categorías Válidas:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {categories.map((category) => (
                <div key={category} className="bg-white px-3 py-2 rounded border text-sm">
                  {category}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <p>• Los nombres de las columnas deben ser exactamente como se muestra arriba</p>
            <p>• La categoría debe ser una de las categorías válidas listadas</p>
            <p>• La cantidad y el precio deben ser números</p>
            <p>• Para cócteles, shots y hervidos, la cantidad puede dejarse en blanco</p>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            <span>Descargar Plantilla</span>
          </button>
        </div>
      </div>
    </div>
  );
};