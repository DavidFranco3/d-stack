import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.resource('auth/login').safe().post({ email, password });

      if (res.ok && res.data) {
        onLogin(res.data.user);
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
      
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card glass-card"
      >
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Zap size={22} color="#000" strokeWidth={2.5} />
          </div>
          <h1 className="auth-title">Acceso <span className="text-[#ffd000]">D-Stack</span></h1>
          <p className="auth-subtitle">Ingresa tus credenciales para administrar el monolito</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={16} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
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
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="alert-error"
            >
              <AlertCircle size={15} />
              <span>{error}</span>
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary mt-2"
          >
            <span>{loading ? 'Autenticando...' : 'Iniciar Sesión'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}