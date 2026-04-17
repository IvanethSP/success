import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { demoEarnings, demoUsers } from '../data/users';
import { TrendingUp, Users, Camera, ShoppingBag, Calculator, Crown, ChevronRight, Leaf, BarChart3, Heart, Share2, Settings, MapPin } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const networkUsers = demoUsers.filter(u => u.id !== 1);
  const activeCount = networkUsers.filter(u => u.subscriptionActive).length;
  const totalNetwork = networkUsers.length;

  const handleShare = async () => {
    const text = `¡Únete a SUCCESS! Usa mi código de referido: ${user?.referralCode}\n\nDescubre productos FUXION para tu bienestar. Descarga la app: https://success.app`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SUCCESS - Únete a mi red', text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      showToast('Código copiado al portapapeles');
    }
  };

  const quickActions = [
    { label: 'Analizar', desc: 'Foto de comida', icon: Camera, href: '/analyzer', color: '#22c55e' },
    { label: 'Tienda', desc: '36 productos', icon: ShoppingBag, href: '/catalog', color: '#D4A843' },
    { label: 'Progreso', desc: 'Rachas y metas', icon: BarChart3, href: '/progress', color: '#F59E0B' },
    { label: 'Mi Red', desc: `${totalNetwork} personas`, icon: Users, href: '/network', color: '#8b5cf6' },
    { label: 'Mi Plan', desc: 'Nutrición', icon: Heart, href: '/nutrition', color: '#ef4444' },
    { label: 'Lugares', desc: 'Restaurantes fit', icon: MapPin, href: '/restaurants', color: '#10b981' },
    { label: 'Calcular', desc: 'Ganancias', icon: Calculator, href: '/calculator', color: '#3b82f6' },
  ];

  return (
    <div className="page stagger">
      {/* Welcome */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>¡Hola de nuevo!</p>
        <h1>{user?.name ?? 'Usuario'}</h1>
        {user?.isAdmin && <span className="badge badge-gold" style={{ marginTop: 4, display: 'inline-flex' }}>Administradora</span>}
      </div>

      {/* Earnings Card */}
      <div className="gradient-header" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '0.8125rem', opacity: 0.7, fontWeight: 500 }}>Ganancias del mes</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: 4 }}>
              S/ {demoEarnings.total.toFixed(2)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 12px' }}>
            <TrendingUp size={14} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>+18%</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 12px' }}>
            <p style={{ fontSize: '0.6875rem', opacity: 0.7 }}>Suscripción</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>S/ 20/mes</p>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 12px' }}>
            <p style={{ fontSize: '0.6875rem', opacity: 0.7 }}>Red total</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{totalNetwork} personas</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(43,122,61,0.1)' }}>
            <Users size={18} color="var(--primary)" />
          </div>
          <p className="stat-value">{totalNetwork}</p>
          <p className="stat-label">En tu red</p>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <TrendingUp size={18} color="#22c55e" />
          </div>
          <p className="stat-value">{activeCount}</p>
          <p className="stat-label">Activos</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="card card-padding" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(212,168,67,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Crown size={20} color="#D4A843" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Tu código de referido</p>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: 1 }}>{user?.referralCode || 'IVANETH001'}</p>
        </div>
        <button className="btn btn-sm btn-primary" onClick={handleShare}>
          <Share2 size={14} /> Compartir
        </button>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 12 }}>Acciones rápidas</h2>
        <div className="grid-2">
          {quickActions.map(a => (
            <button key={a.href} className="quick-action" onClick={() => navigate(a.href)}>
              <div className="quick-action-icon" style={{ background: a.color }}>
                <a.icon size={20} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{a.label}</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{a.desc}</p>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </button>
          ))}
        </div>
      </div>

      {/* Admin Quick Access */}
      {user?.isAdmin && (
        <button className="card card-padding" onClick={() => navigate('/admin')} style={{
          marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, width: '100%',
          border: '1px solid rgba(212,168,67,0.3)', background: 'rgba(212,168,67,0.05)',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(212,168,67,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={20} color="#D4A843" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Panel de Administración</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gestionar comisiones, pagos y afiliados</p>
          </div>
          <ChevronRight size={16} color="#D4A843" />
        </button>
      )}

      {/* Plan Status */}
      <div className="card card-padding" style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(212,168,67,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={20} color="#D4A843" />
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Plan SUCCESS Premium</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Suscripción activa · S/20/mes</p>
          </div>
        </div>
        <span className="badge badge-success">Activo</span>
      </div>
    </div>
  );
}
