import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { ToastProvider } from './components/Toast';
import MobileNav from './components/MobileNav';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import CatalogPage from './pages/Catalog';
import NetworkPage from './pages/Network';
import NutritionPage from './pages/Nutrition';
import AnalyzerPage from './pages/Analyzer';
import CalculatorPage from './pages/Calculator';
import ProgressPage from './pages/Progress';
import CartPage from './pages/Cart';
import AdminPage from './pages/Admin';
import RestaurantsPage from './pages/Restaurants';
import ProfilePage from './pages/Profile';
import { useState, useEffect } from 'react';
import { Leaf, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function TopBar() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('success_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  if (!user) return null;

  const mainPages = ['/dashboard', '/catalog', '/analyzer', '/progress', '/profile'];
  const isSubPage = !mainPages.includes(location.pathname);
  const pageTitle: Record<string, string> = {
    '/network': 'Mi Red',
    '/nutrition': 'Plan Nutricional',
    '/calculator': 'Calculadora',
    '/cart': 'Mi Carrito',
    '/admin': 'Panel Admin',
    '/restaurants': 'Lugares Saludables',
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isSubPage && (
            <button className="btn btn-sm btn-ghost" onClick={() => navigate(-1)} style={{ padding: 4, marginRight: 4 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          {isSubPage ? (
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{pageTitle[location.pathname] || ''}</span>
          ) : (
            <>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(43,122,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={18} color="var(--primary)" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: 1, color: 'var(--primary)' }}>SUCCESS</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button className="theme-toggle" onClick={() => navigate('/cart')} title="Carrito" style={{ position: 'relative' }}>
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user?.isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const showNav = user && location.pathname !== '/' && location.pathname !== '/register';

  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/catalog" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><NetworkPage /></ProtectedRoute>} />
        <Route path="/nutrition" element={<ProtectedRoute><NutritionPage /></ProtectedRoute>} />
        <Route path="/analyzer" element={<ProtectedRoute><AnalyzerPage /></ProtectedRoute>} />
        <Route path="/calculator" element={<ProtectedRoute><CalculatorPage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/restaurants" element={<ProtectedRoute><RestaurantsPage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <MobileNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
