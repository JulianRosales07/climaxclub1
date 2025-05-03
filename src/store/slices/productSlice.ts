import { StateCreator } from 'zustand';
import { Product } from '../../types';
import productsData from '../../db.json';
import toast from 'react-hot-toast';

export interface ProductState {
  products: Product[];
}

export interface ProductActions {
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getLowStockProducts: () => Promise<Product[]>;
}

export type ProductSlice = ProductState & ProductActions;

export const createProductSlice: StateCreator<ProductSlice> = (set, get) => ({
  products: [],
  
  loadProducts: async () => {
    try {
      set({ products: productsData });
    } catch (error) {
      console.error('Error loading products:', error);
      set({ products: [] });
      toast.error('Error al cargar los productos');
    }
  },
  
  addProduct: async (product) => {
    try {
      const newProduct = {
        ...product,
        id: crypto.randomUUID()
      };
      set((state) => ({
        products: [...state.products, newProduct],
      }));
      toast.success('Producto agregado exitosamente');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error al agregar el producto');
    }
  },
  
  updateProduct: async (product) => {
    try {
      set((state) => ({
        products: state.products.map((p) => (p.id === product.id ? product : p)),
      }));
      toast.success('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
    }
  },
  
  deleteProduct: async (id) => {
    try {
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
      toast.success('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
    }
  },

  getLowStockProducts: async () => {
    try {
      const products = get().products;
      return products.filter(product => 
        product.quantity !== null && 
        product.minStock !== undefined && 
        product.quantity <= product.minStock
      );
    } catch (error) {
      console.error('Error getting low stock products:', error);
      toast.error('Error al obtener productos con bajo stock');
      return [];
    }
  },
});