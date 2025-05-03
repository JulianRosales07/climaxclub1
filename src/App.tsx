import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/home/HomePage';
import { InventoryMovementsTab } from './components/inventory/InventoryMovementsTab';
import { SalesTab } from './components/SalesTab';
import { ReportsTab } from './components/ReportsTab';
import { LoadingAnimation } from './components/LoadingAnimation';
import { Toast } from './components/Toast';
import { LoginPage } from './components/auth/LoginPage';
import { ClientView } from './components/ClientView';
import { SongRequestPage } from './components/client/SongRequestPage';
import { UserManagement } from './components/admin/UserManagement';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/authStore';
import { initializeAdminUser } from './scripts/initAdmin';

// Create a wrapper component to use router hooks
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { loadProducts, loadSales, loadMovements, products } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await initializeAdminUser();
      await loadProducts();
      if (user?.role !== 'client') {
        await loadSales();
        await loadMovements();
      }
      setTimeout(() => setIsLoading(false), 2000);
    };
    initializeApp();
  }, [loadProducts, loadSales, loadMovements, user?.role]);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        activeTab={location.pathname.slice(1) || 'home'} 
        setActiveTab={(tab) => navigate(`/${tab}`)}
        userRole={user.role}
      />
      <main className="py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {user.role === 'client' ? (
            <>
              <Route path="/products" element={<ClientView products={products} />} />
              <Route path="/songs" element={<SongRequestPage />} />
            </>
          ) : (
            <>
              <Route 
                path="/inventory" 
                element={<InventoryMovementsTab canModify={['admin', 'employee'].includes(user.role)} />} 
              />
              <Route path="/sales" element={<SalesTab />} />
              <Route 
                path="/reports" 
                element={<ReportsTab canModify={user.role === 'admin'} />} 
              />
              {user.role === 'admin' && (
                <Route path="/users" element={<UserManagement />} />
              )}
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toast />
    </div>
  );
}

// Main App component wraps the content with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;