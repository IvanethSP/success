import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Camera, BarChart3, User } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/catalog', label: 'Tienda', icon: ShoppingBag },
  { href: '/analyzer', label: 'Análisis', icon: Camera },
  { href: '/progress', label: 'Progreso', icon: BarChart3 },
  { href: '/profile', label: 'Perfil', icon: User },
];

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map(item => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.href)}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="nav-safe-area" />
    </nav>
  );
}
