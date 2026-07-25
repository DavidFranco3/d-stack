import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('admin@dstack.com');
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res: any = await api.resource('auth/login').safe().post({ email, password });

      if (res.ok && res.data) {
        onLogin(res.data.token, res.data.user);
      } else {
        setError(res.error?.message || res.data?.message || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión. ¿Está corriendo el servidor API?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="grid-bg" />
      <div className="glow glow-top-left" />
      <div className="glow glow-bottom-right" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card glass-card"
      >
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Rocket size={26} color="white" />
          </div>
          <h1 className="auth-title">Bienvenido a <span className="gradient-text">D-Stack</span></h1>
          <p className="auth-subtitle">Ingresa tus credenciales para acceder al monolito</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="admin@dstack.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="alert-error"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            <span>{loading ? 'Autenticando...' : 'Iniciar Sesión'}</span>
            {!loading && <ChevronRight size={18} />}
          </button>
        </form>

        <div className="auth-credentials-box">
          <p className="auth-credentials-text">
            Admin por defecto: <span className="auth-credential-chip">admin@dstack.com</span> / <span className="auth-credential-chip">12345678</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
