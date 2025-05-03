import React, { useState } from 'react';
import { Edit2, Trash2, Beer } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Product, Category } from '../../types';
import { ExcelTemplatePreview } from './ExcelTemplatePreview';
import { ImportExcel } from './ImportExcel';
import { ProductForm } from './ProductForm';
import toast from 'react-hot-toast';

interface InventoryContentProps {
  canModify: boolean;
}

const categories: Category[] = ['Licores', 'Cócteles', 'Granizados', 'Shots', 'Cervezas', 'Hervidos', 'Bebidas'];

export const InventoryContent: React.FC<InventoryContentProps> = ({ canModify }) => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    imageUrl: '',
    description: '',
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        category: formData.category as Category,
        quantity: formData.quantity ? Number(formData.quantity) : null,
        price: Number(formData.price),
        imageUrl: formData.imageUrl || undefined,
        description: formData.description || undefined,
      };

      if (editingProduct) {
        await updateProduct({ ...productData, id: editingProduct.id });
        setEditingProduct(null);
      } else {
        await addProduct(productData);
      }

      setFormData({
        name: '',
        category: '',
        quantity: '',
        price: '',
        imageUrl: '',
        description: '',
      });
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error('Error al guardar el producto');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity?.toString() ?? '',
      price: product.price.toString(),
      imageUrl: product.imageUrl ?? '',
      description: product.description ?? '',
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      await deleteProduct(id);
    }
  };

  const handleImportProducts = async (products: Omit<Product, 'id'>[]) => {
    for (const product of products) {
      await addProduct(product);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
  };

  return (
    <>
      {canModify && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          
          <ProductForm
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            categories={categories}
          />
          
          <ImportExcel
            onImport={handleImportProducts}
            onShowTemplate={() => setShowTemplatePreview(true)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-w-4 aspect-h-3 w-full">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <Beer className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.category}</p>
              <p className="text-xl font-bold text-blue-600">
                ${product.price.toLocaleString()}
              </p>
              {product.quantity !== null && (
                <p className="text-sm text-gray-600">
                  Stock: {product.quantity}
                </p>
              )}
              {product.description && (
                <p className="text-sm text-gray-500 mt-2">{product.description}</p>
              )}
              {canModify && (
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ExcelTemplatePreview
        isOpen={showTemplatePreview}
        onClose={() => setShowTemplatePreview(false)}
      />
    </>
  );
};