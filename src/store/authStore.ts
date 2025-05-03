import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types/user';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

const ADMIN_USERS: User[] = [
  {
    id: '1',
    employeeId: '1193051330',
    name: 'Administrador',
    email: 'admin@climax.com',
    role: 'admin',
    active: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    employeeId: '3173296534',
    name: 'Administrador 2',
    email: 'admin2@climax.com',
    role: 'admin',
    active: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }
];

interface AuthState {
  user: User | null;
  login: (employeeId?: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (employeeId?: string) => {
        try {
          if (!employeeId) {
            // Client login
            const clientUser: User = {
              id: crypto.randomUUID(),
              role: 'client',
              active: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            };
            set({ user: clientUser });
            return;
          }

          // Check for admin users first
          const adminUser = ADMIN_USERS.find(admin => admin.employeeId === employeeId);
          if (adminUser) {
            set({ user: { ...adminUser, lastLogin: new Date().toISOString() } });
            toast.success(`Bienvenido ${adminUser.name}`);
            return;
          }

          // For other employees, check the database
          const users = await userService.getAll();
          const user = users.find(u => u.employeeId === employeeId);

          if (!user) {
            toast.error('Usuario no encontrado');
            return;
          }

          if (!user.active) {
            toast.error('Usuario inactivo');
            return;
          }

          // Update last login
          const updatedUser = {
            ...user,
            lastLogin: new Date().toISOString(),
          };
          await userService.update(updatedUser);
          set({ user: updatedUser });
          toast.success(`Bienvenido ${user.name || user.role}`);
        } catch (error) {
          console.error('Error during login:', error);
          toast.error('Error al iniciar sesión');
        }
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);