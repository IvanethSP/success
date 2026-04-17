import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Leaf, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (login(email, password)) {
        navigate('/dashboard');
      } else {
        setError('Email o contraseña incorrectos');
      }
      setLoading(false);
    }, 600);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      navigate('/dashboard');
    }, 800);
  };

  const handleDemo = () => {
    setLoading(true);
    setTimeout(() => {
      login('ivaneth@success.app', 'admin123');
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="login-bg">
      <div className="login-circle" style={{ width: 220, height: 220, top: -70, left: -70 }} />
      <div className="login-circle" style={{ width: 160, height: 160, bottom: -50, right: -50 }} />

      <div style={{ width: '100%', maxWidth: 360, position: 'relative', zIndex: 10 }}>
        <div className="login-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={28} color="#D4A843" />
            </div>
          </div>
          <h1 style={{ fontSize: '1.75rem', letterSpacing: 3, fontWeight: 800 }}>SUCCESS</h1>
          <p style={{ fontSize: '0.8125rem', opacity: 0.7 }}>Tu asesor nutricional inteligente</p>
        </div>

        <div className="login-card">
          {/* Google Sign In */}
          <button className="btn btn-full" onClick={handleGoogle} disabled={loading} style={{
            background: '#fff', color: '#3c4043', border: '1px solid #dadce0',
            borderRadius: 8, padding: '12px 24px', fontSize: '0.875rem', fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            width: '100%', fontFamily: 'inherit',
          }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="divider"><div className="divider-line" /><span className="divider-text">o con email</span><div className="divider-line" /></div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="input-group">
              <label>Correo electrónico</label>
              <div className="input-wrap">
                <Mail size={18} />
                <input className="input" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <div className="input-wrap">
                <Lock size={18} />
                <input className="input" type={showPass ? 'text' : 'password'} placeholder="Tu contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-secondary)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '0.8125rem', textAlign: 'center' }}>{error}</p>}

            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Iniciar Sesión'}
            </button>
          </form>

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <a onClick={() => navigate('/register')} style={{ fontSize: '0.8125rem', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'none', fontWeight: 600 }}>
              ¿No tienes cuenta? Afíliate aquí
            </a>
          </div>

          <button onClick={handleDemo} style={{
            marginTop: 12, width: '100%', padding: '10px 0', border: '1px dashed var(--border)',
            borderRadius: 8, background: 'transparent', cursor: 'pointer', fontSize: '0.75rem',
            color: 'var(--text-secondary)', fontFamily: 'inherit', transition: 'all 0.2s ease',
          }}>
            🎮 Acceso Demo (Ivaneth Silva)
          </button>
        </div>
      </div>
    </div>
  );
}
