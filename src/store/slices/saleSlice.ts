import { StateCreator } from 'zustand';
import { Sale } from '../../types';
import toast from 'react-hot-toast';
import { StoreState } from '../useStore';

export interface SaleSlice {
  sales: Sale[];
  loadSales: () => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => Promise<void>;
  updateSale: (sale: Sale) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  resetSales: () => Promise<void>;
}

export const createSaleSlice: StateCreator<StoreState> = (set, get) => ({
  sales: [],
  
  loadSales: async () => {
    try {
      set({ sales: [] });
    } catch (error) {
      console.error('Error loading sales:', error);
      toast.error('Error al cargar las ventas');
    }
  },

  addSale: async (sale) => {
    try {
      const currentProduct = get().products.find(p => p.id === sale.productId);
      
      if (!currentProduct) {
        throw new Error('Producto no encontrado');
      }

      if (currentProduct.quantity !== null) {
        const newQuantity = currentProduct.quantity - sale.quantity;
        
        if (newQuantity < 0) {
          throw new Error('No hay suficiente stock disponible');
        }

        const newSale = {
          ...sale,
          id: crypto.randomUUID(),
          date: new Date().toISOString()
        };

        set((state) => ({
          sales: [...state.sales, newSale],
          products: state.products.map((product) => {
            if (product.id === sale.productId && product.quantity !== null) {
              return { ...product, quantity: newQuantity };
            }
            return product;
          }),
        }));
        toast.success('Venta registrada exitosamente');
      } else {
        // For products without quantity tracking (like cocktails)
        const newSale = {
          ...sale,
          id: crypto.randomUUID(),
          date: new Date().toISOString()
        };

        set((state) => ({
          sales: [...state.sales, newSale]
        }));
        toast.success('Venta registrada exitosamente');
      }
    } catch (error) {
      console.error('Error registering sale:', error);
      toast.error(error instanceof Error ? error.message : 'Error al registrar la venta');
    }
  },

  updateSale: async (sale) => {
    try {
      set((state) => ({
        sales: state.sales.map((s) => (s.id === sale.id ? sale : s)),
      }));
      toast.success('Venta actualizada exitosamente');
    } catch (error) {
      console.error('Error updating sale:', error);
      toast.error('Error al actualizar la venta');
    }
  },

  deleteSale: async (id) => {
    try {
      set((state) => ({
        sales: state.sales.filter((s) => s.id !== id),
      }));
      toast.success('Venta eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Error al eliminar la venta');
    }
  },

  resetSales: async () => {
    try {
      set({ sales: [] });
    } catch (error) {
      console.error('Error resetting sales:', error);
      toast.error('Error al reiniciar las ventas');
    }
  },
});