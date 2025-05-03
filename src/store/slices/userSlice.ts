import { StateCreator } from 'zustand';
import { User } from '../../types/user';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export interface UserState {
  users: User[];
}

export interface UserActions {
  loadUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export type UserSlice = UserState & UserActions;

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  users: [],
  
  loadUsers: async () => {
    try {
      const users = await userService.getAll();
      set({ users });
    } catch (error) {
      console.error('Error loading users:', error);
      set({ users: [] });
      toast.error('Error al cargar los usuarios');
    }
  },
  
  addUser: async (user) => {
    try {
      const newUser = await userService.add(user);
      set((state) => ({
        users: [...state.users, newUser],
      }));
      toast.success('Usuario agregado exitosamente');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error al agregar el usuario');
    }
  },
  
  updateUser: async (user) => {
    try {
      await userService.update(user);
      set((state) => ({
        users: state.users.map((u) => (u.id === user.id ? user : u)),
      }));
      toast.success('Usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar el usuario');
    }
  },
  
  deleteUser: async (id) => {
    try {
      await userService.delete(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
      toast.success('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar el usuario');
    }
  },
});