export type UserRole = 'client' | 'employee' | 'admin';

export interface User {
  id: string;
  employeeId?: string;
  role: UserRole;
  name?: string;
  email?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}