import React, { useState } from 'react';
import { Beer, BarChart2, ShoppingCart, Home, LogOut, User, Menu, X, Music, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/user';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, userRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const getNavItems = () => {
    const items = [
      {
        id: 'home',
        label: 'Inicio',
        icon: Home,
        roles: ['client', 'employee', 'admin'],
      },
      {
        id: 'products',
        label: 'Productos',
        icon: Beer,
        roles: ['client'],
      },
      {
        id: 'songs',
        label: 'Solicitar Canciones',
        icon: Music,
        roles: ['client'],
      },
      {
        id: 'inventory',
        label: 'Inventario',
        icon: Beer,
        roles: ['employee', 'admin'],
      },
      {
        id: 'sales',
        label: 'Ventas',
        icon: ShoppingCart,
        roles: ['employee', 'admin'],
      },
      {
        id: 'reports',
        label: 'Reportes',
        icon: BarChart2,
        roles: ['employee', 'admin'],
      },
      {
        id: 'users',
        label: 'Usuarios',
        icon: Users,
        roles: ['admin'],
      },
    ];

    return items.filter(item => item.roles.includes(userRole));
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'employee':
        return 'Empleado';
      case 'client':
        return 'Cliente';
    }
  };

  const handleNavigation = (id: string) => {
    setActiveTab(id);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold">CLIMAX</h1>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-700 rounded-lg"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden lg:flex items-center gap-2">
            {getNavItems().map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
              <User size={20} />
              <span>{getRoleLabel(userRole)}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-50 transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
        <div className="absolute inset-y-0 left-0 w-64 bg-gray-800 shadow-lg transform transition-transform duration-300">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">CLIMAX</h1>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
              <User size={20} />
              <span>{getRoleLabel(userRole)}</span>
            </div>

            <div className="space-y-2">
              {getNavItems().map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={20} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};