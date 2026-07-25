import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ResourcesPage from './pages/ResourcesPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (newToken: string, newUser: any) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            token ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
          } 
        />
        
        {/* Protected App Modules inside AppLayout */}
        <Route 
          element={
            token ? <AppLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
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
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
