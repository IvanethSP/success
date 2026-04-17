import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { demoUsers, COMMISSION_RATES, SUBSCRIPTION_PRICE } from '../data/users';
import { Settings, Users, DollarSign, Shield, CheckCircle, XCircle, Clock, Star, ChevronDown, ChevronUp, Image } from 'lucide-react';

export default function AdminPage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<'params'|'payments'|'users'>('params');

  // App params (simulated - stored in localStorage)
  const [rates, setRates] = useState(() => {
    const saved = localStorage.getItem('success_rates');
    return saved ? JSON.parse(saved) : COMMISSION_RATES.map(r => Math.round(r.rate * 100));
  });
  const [subPrice, setSubPrice] = useState(() => {
    return Number(localStorage.getItem('success_sub_price') || SUBSCRIPTION_PRICE);
  });
  const [productPrice, setProductPrice] = useState(() => {
    return Number(localStorage.getItem('success_product_price') || 35);
  });
  const [level8Enabled, setLevel8Enabled] = useState(() => {
    return localStorage.getItem('success_level8') === 'true';
  });
  const [level8Rate, setLevel8Rate] = useState(() => {
    return Number(localStorage.getItem('success_level8_rate') || 10);
  });

  const saveParams = () => {
    localStorage.setItem('success_rates', JSON.stringify(rates));
    localStorage.setItem('success_sub_price', String(subPrice));
    localStorage.setItem('success_product_price', String(productPrice));
    localStorage.setItem('success_level8', String(level8Enabled));
    localStorage.setItem('success_level8_rate', String(level8Rate));
    showToast('Parámetros guardados correctamente');
  };

  // Payment validation
  const allUsers = [...demoUsers, ...JSON.parse(localStorage.getItem('success_registered') || '[]')];
  const pendingPayments = allUsers.filter(u => u.affiliation?.status === 'pending');
  const allAffiliated = allUsers.filter(u => u.id !== 1);

  const handleApprove = (userId: number) => {
    showToast(`Pago del usuario #${userId} aprobado ✓`);
  };

  const handleReject = (userId: number) => {
    showToast(`Pago del usuario #${userId} rechazado`, 'warning');
  };

  const tabs = [
    { id: 'params' as const, label: 'Parámetros', icon: Settings },
    { id: 'payments' as const, label: 'Pagos', icon: DollarSign, badge: pendingPayments.length },
    { id: 'users' as const, label: 'Afiliados', icon: Users },
  ];

  return (
    <div className="page">
      {/* Tab Selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--bg)', borderRadius: 8, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.id} className={`filter-pill ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)} style={{ flex: 1, position: 'relative' }}>
            <t.icon size={14} />
            <span>{t.label}</span>
            {t.badge ? <span className="cart-badge" style={{ top: -4, right: -4 }}>{t.badge}</span> : null}
          </button>
        ))}
      </div>

      {/* PARAMS TAB */}
      {tab === 'params' && (
        <div className="stagger">
          {/* Commission Rates */}
          <div className="card card-padding" style={{ marginBottom: 12 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <DollarSign size={18} color="var(--primary)" /> Comisiones por Nivel
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rates.map((rate: number, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: 50 }}>Nivel {i + 1}</span>
                  <input type="range" min="0" max="30" value={rate} onChange={e => { const r = [...rates]; r[i] = Number(e.target.value); setRates(r); }} style={{ flex: 1 }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, width: 36, textAlign: 'right', color: 'var(--primary)' }}>{Math.round(rate)}%</span>
                </div>
              ))}
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Total: {Math.round(rates.reduce((sum: number, r: number) => sum + r, 0))}% (máximo recomendado: 100%)
              </p>
            </div>
          </div>

          {/* Level 8 Elite */}
          <div className="card card-padding" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: level8Enabled ? 12 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Star size={18} color="#D4A843" />
                <div>
                  <h3>Nivel 8 Élite</h3>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Para usuarios que cumplan requisitos especiales</p>
                </div>
              </div>
              <div className="toggle-switch" data-active={level8Enabled ? 'true' : 'false'} onClick={() => setLevel8Enabled(!level8Enabled)}>
                <div className="toggle-knob" />
              </div>
            </div>
            {level8Enabled && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Comisión:</span>
                <input type="range" min="1" max="20" value={level8Rate} onChange={e => setLevel8Rate(Number(e.target.value))} style={{ flex: 1 }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#D4A843' }}>{level8Rate}%</span>
              </div>
            )}
          </div>

          {/* Prices */}
          <div className="card card-padding" style={{ marginBottom: 12 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Settings size={18} color="var(--primary)" /> Precios
            </h3>
            <div className="grid-2">
              <div className="input-group">
                <label>Suscripción mensual (S/)</label>
                <input className="input" style={{ paddingLeft: 12 }} type="number" value={subPrice} onChange={e => setSubPrice(Number(e.target.value))} />
              </div>
              <div className="input-group">
                <label>Precio base producto (S/)</label>
                <input className="input" style={{ paddingLeft: 12 }} type="number" value={productPrice} onChange={e => setProductPrice(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={saveParams}>
            <CheckCircle size={16} /> Guardar Parámetros
          </button>
        </div>
      )}

      {/* PAYMENTS TAB */}
      {tab === 'payments' && (
        <div>
          {pendingPayments.length > 0 ? (
            <>
              <h3 style={{ marginBottom: 12, color: '#F59E0B' }}>
                <Clock size={16} /> {pendingPayments.length} pendientes de aprobación
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {pendingPayments.map(u => (
                  <div key={u.id} className="card card-padding">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <p style={{ fontWeight: 600 }}>{u.name}</p>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                          Patrocinador: {u.affiliation?.sponsorCode} · Mes: {u.affiliation?.paymentMonth}
                        </p>
                      </div>
                      <span className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>Pendiente</span>
                    </div>
                    {u.affiliation?.paymentProofUrl && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, padding: '6px 10px', background: 'var(--bg)', borderRadius: 6, fontSize: '0.75rem' }}>
                        <Image size={14} color="var(--primary)" />
                        <span>{u.affiliation.paymentProofUrl}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-primary" style={{ flex: 1 }} onClick={() => handleApprove(u.id)}>
                        <CheckCircle size={14} /> Aprobar
                      </button>
                      <button className="btn btn-sm" style={{ flex: 1, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }} onClick={() => handleReject(u.id)}>
                        <XCircle size={14} /> Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <CheckCircle size={48} color="#22c55e" />
              <h3 style={{ marginTop: 8 }}>Sin pagos pendientes</h3>
              <p>Todos los pagos han sido procesados</p>
            </div>
          )}

          <h3 style={{ marginBottom: 12 }}>Historial reciente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {allAffiliated.filter(u => u.affiliation?.status === 'approved').slice(0, 6).map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'var(--bg)' }}>
                <CheckCircle size={14} color="#22c55e" />
                <span style={{ flex: 1, fontSize: '0.8125rem' }}>{u.name}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{u.affiliation?.approvedAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {tab === 'users' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <h3>Todos los afiliados</h3>
            <span className="badge badge-primary">{allAffiliated.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {allAffiliated.map(u => (
              <div key={u.id} className="card card-padding" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: u.subscriptionActive ? 'rgba(43,122,61,0.1)' : 'rgba(239,68,68,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6875rem', fontWeight: 700,
                  color: u.subscriptionActive ? 'var(--primary)' : '#ef4444',
                }}>
                  {u.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                    Nivel {u.level} · {u.referredBy || '-'} {u.whatsapp ? `· ${u.whatsapp}` : ''}
                  </p>
                </div>
                <span className={`badge ${u.subscriptionActive ? 'badge-success' : ''}`} style={u.subscriptionActive ? {} : { background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  {u.subscriptionActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
