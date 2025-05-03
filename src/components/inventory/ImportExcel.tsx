import React, { useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Product, Category } from '../../types';
import toast from 'react-hot-toast';

interface ImportExcelProps {
  onImport: (products: Omit<Product, 'id'>[]) => void;
  onShowTemplate: () => void;
}

export const ImportExcel: React.FC<ImportExcelProps> = ({ onImport, onShowTemplate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const products: Omit<Product, 'id'>[] = jsonData.map((row: any) => ({
          name: row.Nombre,
          category: row.Categoria as Category,
          quantity: row.Cantidad || null,
          price: row.Precio,
        }));

        onImport(products);
        toast.success('Productos importados exitosamente');
      } catch (error) {
        console.error('Error importing Excel:', error);
        toast.error('Error al importar el archivo Excel');
      }
    };

    reader.onerror = () => {
      toast.error('Error al leer el archivo');
    };

    reader.readAsBinaryString(file);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="mt-6 flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportExcel}
        accept=".xlsx,.xls"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Upload size={20} />
        <span>Importar Excel</span>
      </button>
      <button
        onClick={onShowTemplate}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        <Download size={20} />
        <span>Ver Plantilla</span>
      </button>
    </div>
  );
};