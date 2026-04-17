import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Tag, ArrowLeft, Leaf, Upload, Calendar, Phone } from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sponsorCode, setSponsorCode] = useState('');
  const [paymentMonth, setPaymentMonth] = useState('2026-03');
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (step === 1) {
      if (!sponsorCode) { setError('Ingresa el código de tu patrocinador'); return; }
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    // Step 3: Final submit
    setLoading(true);
    setTimeout(() => {
      if (register(name, email, password, sponsorCode || undefined)) {
        navigate('/');
      } else {
        setError('Email ya registrado o código de patrocinador inválido');
      }
      setLoading(false);
    }, 800);
  };

  const handleGoogleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="login-bg">
      <div className="login-circle" style={{ width: 200, height: 200, top: -60, left: -60 }} />
      <div className="login-circle" style={{ width: 150, height: 150, bottom: -40, right: -40 }} />

      <div style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 10 }}>
        <div className="login-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={24} color="#D4A843" />
            </div>
          </div>
          <h1 style={{ fontSize: '1.5rem', letterSpacing: 2 }}>AFÍLIATE A SUCCESS</h1>
          <p>Únete a nuestra red de bienestar</p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, padding: '0 20px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: s <= step ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>

        <div className="login-card">
          {step === 1 && (
            <>
              <button className="btn btn-full" onClick={handleGoogleRegister} disabled={loading} style={{
                background: '#fff', color: '#3c4043', border: '1px solid #dadce0',
                borderRadius: 8, padding: '12px 24px', fontSize: '0.875rem', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                cursor: 'pointer', width: '100%', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Registrarse con Google
              </button>

              <div className="divider"><div className="divider-line" /><span className="divider-text">o con email</span><div className="divider-line" /></div>

              <h3 style={{ marginBottom: 12, fontSize: '0.875rem' }}>Paso 1: Patrocinador y datos</h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="input-group">
                  <label style={{ fontWeight: 600, color: 'var(--primary)' }}>Código del patrocinador *</label>
                  <div className="input-wrap"><Tag size={18} /><input className="input" type="text" placeholder="Ej: IVANETH001" value={sponsorCode} onChange={e => setSponsorCode(e.target.value.toUpperCase())} required /></div>
                </div>
                <div className="input-group">
                  <label>Nombre completo</label>
                  <div className="input-wrap"><User size={18} /><input className="input" type="text" placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} required /></div>
                </div>
                <div className="input-group">
                  <label>Correo electrónico</label>
                  <div className="input-wrap"><Mail size={18} /><input className="input" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                </div>
                <div className="input-group">
                  <label>Contraseña</label>
                  <div className="input-wrap"><Lock size={18} /><input className="input" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} /></div>
                </div>
                <div className="input-group">
                  <label>WhatsApp <span style={{ color: 'var(--text-muted)' }}>(opcional)</span></label>
                  <div className="input-wrap"><Phone size={18} /><input className="input" type="tel" placeholder="+51 999 888 777" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} /></div>
                </div>

                {error && <p style={{ color: '#ef4444', fontSize: '0.8125rem', textAlign: 'center' }}>{error}</p>}

                <button className="btn btn-primary btn-full" type="submit">Siguiente →</button>
              </form>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ marginBottom: 8, fontSize: '0.875rem' }}>Paso 2: Pago de afiliación</h3>

              <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(43,122,61,0.08)', border: '1px solid rgba(43,122,61,0.15)' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)' }}>Suscripción mensual: S/ 20</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: 4 }}>Puede pagar con Yape, Plin o Mercado Pago al número que le proporcione su patrocinador.</p>
              </div>

              <div className="input-group">
                <label>Mes que está pagando</label>
                <div className="input-wrap">
                  <Calendar size={18} />
                  <input className="input" type="month" value={paymentMonth} onChange={e => setPaymentMonth(e.target.value)} required />
                </div>
              </div>

              <div className="input-group">
                <label>Captura del comprobante de pago *</label>
                <label style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '16px 20px', borderRadius: 8, border: '2px dashed var(--border)',
                  cursor: 'pointer', background: paymentProof ? 'rgba(43,122,61,0.05)' : 'var(--bg)',
                  transition: 'all 0.2s ease', fontSize: '0.8125rem', color: 'var(--text-secondary)',
                }}>
                  <Upload size={18} color={paymentProof ? 'var(--primary)' : 'var(--text-muted)'} />
                  {paymentProof || 'Subir imagen del pago'}
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>

              <p style={{ fontSize: '0.6875rem', color: '#F59E0B', textAlign: 'center', padding: '0 8px' }}>
                ⚠️ Su afiliación será habilitada cuando el administrador valide el comprobante de pago.
              </p>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>← Atrás</button>
                <button className="btn btn-primary" type="submit" style={{ flex: 2 }}>Siguiente →</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ marginBottom: 8, fontSize: '0.875rem' }}>Paso 3: Confirmar datos</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 16px', borderRadius: 8, background: 'var(--bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Nombre</span>
                  <span style={{ fontWeight: 600 }}>{name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Email</span>
                  <span style={{ fontWeight: 600 }}>{email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Patrocinador</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{sponsorCode}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>WhatsApp</span>
                  <span style={{ fontWeight: 600 }}>{whatsapp || 'No proporcionado'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Mes de pago</span>
                  <span style={{ fontWeight: 600 }}>{paymentMonth}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Comprobante</span>
                  <span style={{ fontWeight: 600, color: paymentProof ? '#22c55e' : '#ef4444' }}>{paymentProof ? '✓ Adjunto' : '✗ Sin adjuntar'}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Al afiliarme acepto los términos y condiciones de SUCCESS.
              </p>

              {error && <p style={{ color: '#ef4444', fontSize: '0.8125rem', textAlign: 'center' }}>{error}</p>}

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(2)}>← Atrás</button>
                <button className="btn btn-primary" type="submit" disabled={loading} style={{ flex: 2 }}>
                  {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : '✓ Afiliarme'}
                </button>
              </div>
            </form>
          )}

          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <a onClick={() => navigate('/')} style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              <ArrowLeft size={14} />
              Ya tengo cuenta, iniciar sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
