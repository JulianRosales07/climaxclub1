import { getStorageData, setStorageData } from '../utils/storage';
import { User } from '../types/user';

const ADMIN_STORAGE_KEY = 'bar_inventory_users';

// This function is now optional since the admin user is hardcoded in the auth store
export const initializeAdminUser = async () => {
  try {
    const adminUser: User = {
      id: crypto.randomUUID(),
      employeeId: '1193051330',
      name: 'Administrador',
      email: 'admin@climax.com',
      role: 'admin',
      active: true,
      createdAt: new Date().toISOString(),
    };

    // Check if admin already exists
    const users = getStorageData<User[]>(ADMIN_STORAGE_KEY, []);
    const existingAdmin = users.find(u => u.employeeId === adminUser.employeeId);

    if (!existingAdmin) {
      setStorageData(ADMIN_STORAGE_KEY, [...users, adminUser]);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};