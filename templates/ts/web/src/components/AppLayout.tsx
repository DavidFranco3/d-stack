import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { 
  Zap, LayoutDashboard, Database, Users, Settings, LogOut, 
  Search, Bell
} from 'lucide-react';

interface AppLayoutProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export default function AppLayout({ user, onLogout }: AppLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const displayName = user?.name && user.name !== 'David Admin' ? user.name : 'Admin';
  const displayEmail = user?.email || 'admin@dstack.com';

  return (
    <div className="flex h-screen bg-[#07090d] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Left Navigation */}
      <aside className="w-64 bg-[#0e1117] border-r border-[#1c222d] flex flex-col justify-between p-4 z-20 shrink-0">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-3 py-3 mb-6 border-b border-[#1c222d]">
            <div className="w-9 h-9 rounded-lg bg-[#ffd000] flex items-center justify-center shadow-[0_0_20px_rgba(255,208,0,0.25)] shrink-0">
              <Zap size={18} color="#000" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-base text-white leading-none">D-Stack</h1>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#181d28] text-[#ffd000] border border-[#242b39]">v1.2</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block mt-1">Full-Stack Monolith</span>
            </div>
          </div>

          {/* Navigation Links with React Router NavLink */}
          <nav className="space-y-1">
            <NavLink 
              to="/dashboard"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-[#ffd000]/10 text-[#ffd000] border border-[#ffd000]/30 shadow-[0_0_15px_rgba(255,208,0,0.12)] font-semibold' 
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Panel Principal</span>
            </NavLink>

            <NavLink 
              to="/resources"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-[#ffd000]/10 text-[#ffd000] border border-[#ffd000]/30 shadow-[0_0_15px_rgba(255,208,0,0.12)] font-semibold' 
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <Database size={16} />
              <span>Módulo CRUD</span>
            </NavLink>

            <NavLink 
              to="/users"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-[#ffd000]/10 text-[#ffd000] border border-[#ffd000]/30 shadow-[0_0_15px_rgba(255,208,0,0.12)] font-semibold' 
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <Users size={16} />
              <span>Usuarios</span>
            </NavLink>

            <NavLink 
              to="/settings"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-[#ffd000]/10 text-[#ffd000] border border-[#ffd000]/30 shadow-[0_0_15px_rgba(255,208,0,0.12)] font-semibold' 
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <Settings size={16} />
              <span>Configuración</span>
            </NavLink>
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="pt-3 border-t border-[#1c222d]">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#131720] border border-[#1c222d]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded bg-[#ffd000]/15 text-[#ffd000] flex items-center justify-center font-bold font-mono text-xs shrink-0 border border-[#ffd000]/30">
                {displayName.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{displayEmail}</p>
              </div>
            </div>
            <button 
              onClick={handleLogoutClick}
              className="text-slate-400 hover:text-[#f43f5e] p-1.5 rounded hover:bg-white/[0.05] transition-colors shrink-0"
              title="Cerrar Sesión"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="grid-bg" />

        {/* Topbar Header */}
        <header className="h-14 border-b border-[#1c222d] bg-[#0e1117]/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3">
            <span className="font-display font-semibold text-sm text-white tracking-wide">Workspace Monolito</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" title="System Active" />
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-56 sm:w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar recursos..."
                className="w-full bg-[#07090d] border border-[#1c222d] rounded-md py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ffd000] transition-colors"
              />
            </div>

            {/* Notifications Icon */}
            <button className="p-2 rounded-md bg-[#131720] border border-[#1c222d] text-slate-400 hover:text-white transition-colors relative shrink-0">
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#ffd000]" />
            </button>
          </div>
        </header>

        {/* Child Module Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}
