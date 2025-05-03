import { StateCreator } from 'zustand';
import { InventoryMovement } from '../../types';
import * as db from '../../db';
import toast from 'react-hot-toast';
import { StoreState } from '../useStore';

export interface MovementSlice {
  movements: InventoryMovement[];
  loadMovements: () => Promise<void>;
  addMovement: (movement: Omit<InventoryMovement, 'id' | 'date'>) => Promise<void>;
  updateMovement: (movement: InventoryMovement) => Promise<void>;
  deleteMovement: (id: string) => Promise<void>;
}

export const createMovementSlice: StateCreator<StoreState> = (set, get) => ({
  movements: [],
  
  loadMovements: async () => {
    try {
      const movements = db.getMovements();
      set({ movements });
    } catch (error) {
      console.error('Error loading movements:', error);
      toast.error('Error al cargar los movimientos');
    }
  },

  addMovement: async (movement) => {
    try {
      const newMovement = db.addMovement(movement);
      const currentProduct = get().products.find(p => p.id === movement.productId);
      
      if (!currentProduct) {
        throw new Error('Producto no encontrado');
      }

      if (currentProduct.quantity !== null) {
        const quantityChange = movement.type === 'recepcion' ? movement.quantity : -movement.quantity;
        const newQuantity = currentProduct.quantity + quantityChange;
        
        set((state) => ({
          movements: [...state.movements, newMovement],
          products: state.products.map((product) => {
            if (product.id === movement.productId && product.quantity !== null) {
              return { ...product, quantity: newQuantity };
            }
            return product;
          }),
        }));
        toast.success('Movimiento registrado exitosamente');
      }
    } catch (error) {
      console.error('Error registering movement:', error);
      toast.error('Error al registrar el movimiento');
    }
  },

  updateMovement: async (movement) => {
    try {
      db.updateMovement(movement);
      const movements = db.getMovements();
      set({ movements });
      toast.success('Movimiento actualizado exitosamente');
    } catch (error) {
      console.error('Error updating movement:', error);
      toast.error('Error al actualizar el movimiento');
    }
  },

  deleteMovement: async (id) => {
    try {
      db.deleteMovement(id);
      const movements = db.getMovements();
      set({ movements });
      toast.success('Movimiento eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting movement:', error);
      toast.error('Error al eliminar el movimiento');
    }
  },
});