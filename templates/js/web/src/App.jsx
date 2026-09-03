import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ResourcesPage from './pages/ResourcesPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import { api } from './api/client';

function App() {
  const [authState, setAuthState] = useState('loading');
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.resource('auth/me').safe().get()
      .then((res) => {
        if (res.ok && res.data?.user) {
          setUser(res.data.user);
          setAuthState('authed');
        } else {
          setAuthState('guest');
        }
      })
      .catch(() => setAuthState('guest'));
  }, []);

  const handleLogin = (newUser) => {
    setUser(newUser);
    setAuthState('authed');
  };

  const handleLogout = async () => {
    try {
      await api.resource('auth/logout').safe().post({});
    } catch {
      // Ignore logout errors
    }
    setUser(null);
    setAuthState('guest');
  };

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center text-slate-400 text-sm">
        Loading...
      </div>
    );
  }

  const isAuthed = authState === 'authed';

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthed ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
          } 
        />
        
        {/* Protected App Modules inside AppLayout */}
        <Route 
          element={
            isAuthed ? <AppLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route 
          path="*" 
          element={<Navigate to={isAuthed ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;