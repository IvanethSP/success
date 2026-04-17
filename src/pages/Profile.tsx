import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HEALTH_GOALS, ACTIVITY_LEVELS, HEALTH_CONDITIONS, PAYMENT_METHODS } from '../data/users';
import { User, Mail, Save, Heart, Moon, Sun, Shield, Share2, Crown, LogOut, Scale, Target, Ruler, Phone, CreditCard, Settings } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(String(user?.age || ''));
  const [weight, setWeight] = useState(String(user?.weight || ''));
  const [height, setHeight] = useState(String(user?.height || ''));
  const [gender, setGender] = useState(user?.gender || 'male');
  const [activity, setActivity] = useState(user?.activityLevel || 'moderate');
  const [goal, setGoal] = useState(user?.healthGoal || 'general');
  const [targetW, setTargetW] = useState(String(user?.targetWeight || ''));
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [payType, setPayType] = useState<string>(user?.paymentInfo?.type || '');
  const [payNumber, setPayNumber] = useState(user?.paymentInfo?.number || '');
  const [conditions, setConditions] = useState<string[]>(user?.healthConditions || []);
  const [dark, setDark] = useState(() => localStorage.getItem('success_theme') === 'dark');

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('success_theme', next ? 'dark' : 'light');
  };

  const toggleCondition = (id: string) => {
    setConditions(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const saveProfile = () => {
    updateProfile({
      name,
      age: parseInt(age) || null,
      weight: parseFloat(weight) || null,
      height: parseInt(height) || null,
      gender,
      activityLevel: activity,
      healthGoal: goal,
      targetWeight: parseFloat(targetW) || null,
      whatsapp: whatsapp || null,
      paymentInfo: payType ? { type: payType as any, number: payNumber } : null,
      healthConditions: conditions,
    });
    setEditing(false);
    showToast('Perfil actualizado correctamente');
  };

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

  const initials = (user?.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="page">
      {/* Header Avatar */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 8px',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '1.5rem', fontWeight: 700, letterSpacing: 1,
          border: '3px solid var(--gold)',
        }}>
          {initials}
        </div>
        <h1 style={{ fontSize: '1.25rem' }}>{user?.name}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{user?.email}</p>
        {user?.isAdmin && <span className="badge badge-gold" style={{ marginTop: 4 }}>Administradora</span>}
      </div>

      {/* Subscription Card */}
      <div className="gradient-header" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Plan activo</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700 }}>SUCCESS Premium</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 4 }}>S/ 20/mes · Comisión 100%</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 12px' }}>
            <Shield size={14} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Activo</span>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="card card-padding" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Crown size={18} color="#D4A843" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mi código de referido</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: 1 }}>{user?.referralCode}</p>
            </div>
          </div>
          <button className="btn btn-sm btn-primary" onClick={handleShare}>
            <Share2 size={14} /> Compartir
          </button>
        </div>
      </div>

      {/* Personal Data */}
      <div className="card card-padding" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: editing ? 14 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} color="var(--primary)" />
            <h3>Datos Personales</h3>
          </div>
          {!editing && (
            <button className="btn btn-sm btn-ghost" onClick={() => setEditing(true)}>Editar</button>
          )}
        </div>

        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="input-group">
              <label>Nombre</label>
              <div className="input-wrap"><User size={18} /><input className="input" value={name} onChange={e => setName(e.target.value)} /></div>
            </div>
            <div className="input-group">
              <label>WhatsApp</label>
              <div className="input-wrap"><Phone size={18} /><input className="input" type="tel" placeholder="+51 999 888 777" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} /></div>
            </div>
            <div className="grid-3">
              <div className="input-group">
                <label>Edad</label>
                <input className="input" style={{ paddingLeft: 12 }} type="number" value={age} onChange={e => setAge(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Peso (kg)</label>
                <input className="input" style={{ paddingLeft: 12 }} type="number" value={weight} onChange={e => setWeight(e.target.value)} step="0.1" />
              </div>
              <div className="input-group">
                <label>Altura (cm)</label>
                <input className="input" style={{ paddingLeft: 12 }} type="number" value={height} onChange={e => setHeight(e.target.value)} />
              </div>
            </div>
            <div className="grid-2">
              <div className="input-group">
                <label>Género</label>
                <select className="select" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
              <div className="input-group">
                <label>Peso meta (kg)</label>
                <input className="input" style={{ paddingLeft: 12 }} type="number" value={targetW} onChange={e => setTargetW(e.target.value)} step="0.1" />
              </div>
            </div>
            <div className="input-group">
              <label>Nivel de actividad</label>
              <select className="select" value={activity} onChange={e => setActivity(e.target.value)}>
                {Object.entries(ACTIVITY_LEVELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Objetivo de salud</label>
              <select className="select" value={goal} onChange={e => setGoal(e.target.value)}>
                {Object.entries(HEALTH_GOALS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
            {[
              { icon: Scale, label: 'Peso', value: `${user?.weight || '-'} kg` },
              { icon: Target, label: 'Meta', value: user?.targetWeight ? `${user.targetWeight} kg` : '-' },
              { icon: Ruler, label: 'Altura', value: `${user?.height || '-'} cm` },
              { icon: User, label: 'Edad', value: user?.age ? `${user.age} años` : '-' },
              { icon: Phone, label: 'WhatsApp', value: user?.whatsapp || 'No registrado' },
            ].map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, background: 'var(--bg)' }}>
                <d.icon size={16} color="var(--text-secondary)" />
                <div>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{d.label}</p>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div className="card card-padding" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <CreditCard size={18} color="var(--primary)" />
          <h3>Datos de Pago</h3>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>(opcional)</span>
        </div>
        {editing ? (
          <div className="grid-2">
            <div className="input-group">
              <label>Método</label>
              <select className="select" value={payType} onChange={e => setPayType(e.target.value)}>
                <option value="">Seleccionar...</option>
                {Object.entries(PAYMENT_METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Número</label>
              <input className="input" style={{ paddingLeft: 12 }} type="tel" placeholder="999 888 777" value={payNumber} onChange={e => setPayNumber(e.target.value)} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, background: 'var(--bg)' }}>
            <CreditCard size={16} color="var(--text-secondary)" />
            <div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Método de cobro</p>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                {user?.paymentInfo ? `${PAYMENT_METHODS[user.paymentInfo.type || ''] || '-'}: ${user.paymentInfo.number}` : 'No registrado'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Health Conditions */}
      <div className="card card-padding" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Heart size={18} color="var(--primary)" />
          <h3>Condiciones de Salud</h3>
        </div>

        {editing ? (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {HEALTH_CONDITIONS.map(c => (
                <button key={c.id} onClick={() => toggleCondition(c.id)} style={{
                  padding: '6px 12px', borderRadius: 20,
                  border: conditions.includes(c.id) ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: conditions.includes(c.id) ? 'rgba(43,122,61,0.1)' : 'var(--bg)',
                  color: conditions.includes(c.id) ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '0.75rem', fontWeight: conditions.includes(c.id) ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
                }}>
                  {conditions.includes(c.id) ? '✓ ' : ''}{c.label}
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 14 }} onClick={saveProfile}>
              <Save size={16} /> Guardar Cambios
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(user?.healthConditions || []).length > 0 ? (
              (user?.healthConditions || []).map(c => {
                const condition = HEALTH_CONDITIONS.find(h => h.id === c);
                return <span key={c} className="badge badge-primary">{condition?.label || c}</span>;
              })
            ) : (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Sin condiciones registradas</p>
            )}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
        <button className="settings-row" onClick={toggleDark}>
          {dark ? <Moon size={18} color="#6366F1" /> : <Sun size={18} color="#F59E0B" />}
          <span style={{ flex: 1 }}>Modo {dark ? 'oscuro' : 'claro'}</span>
          <div className="toggle-switch" data-active={dark ? 'true' : 'false'}>
            <div className="toggle-knob" />
          </div>
        </button>
        {user?.isAdmin && (
          <button className="settings-row" onClick={() => navigate('/admin')}>
            <Settings size={18} color="var(--primary)" />
            <span style={{ flex: 1 }}>Panel de Administración</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>→</span>
          </button>
        )}
      </div>

      {/* Logout */}
      <button className="btn btn-full" onClick={() => { logout(); window.location.href = '/'; }} style={{
        background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)',
      }}>
        <LogOut size={16} /> Cerrar Sesión
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 16 }}>
        SUCCESS v1.0.0 · Powered by FUXION
      </p>
    </div>
  );
}
