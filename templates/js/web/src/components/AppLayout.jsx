import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { 
  Rocket, LayoutDashboard, Database, Users, Settings, LogOut, 
  Search, Bell
} from 'lucide-react';

export default function AppLayout({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const displayName = user?.name && user.name !== 'David Admin' ? user.name : 'Admin';
  const displayEmail = user?.email || 'admin@dstack.com';

  return (
    <div className="flex h-screen bg-[#0a0c10] text-slate-100 overflow-hidden font-inter">
      {/* Sidebar Left Navigation */}
      <aside className="w-64 bg-[#12161f]/90 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between p-4 z-20 shrink-0">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Rocket size={22} color="white" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-lg text-white leading-none">D-Stack App</h1>
              <span className="text-[11px] text-indigo-400 font-medium tracking-wide">MONOLITO FULLSTACK</span>
            </div>
          </div>

          {/* Navigation Links with React Router NavLink */}
          <nav className="space-y-1.5">
            <NavLink 
              to="/dashboard"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Panel Principal</span>
            </NavLink>

            <NavLink 
              to="/resources"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database size={18} />
              <span>Módulo CRUD</span>
            </NavLink>

            <NavLink 
              to="/users"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={18} />
              <span>Usuarios</span>
            </NavLink>

            <NavLink 
              to="/settings"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings size={18} />
              <span>Configuración</span>
            </NavLink>
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-outfit shrink-0 border border-indigo-500/30">
                {displayName.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
              </div>
            </div>
            <button 
              onClick={handleLogoutClick}
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0"
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="grid-bg" />

        {/* Topbar Header */}
        <header className="h-16 border-b border-white/10 bg-[#12161f]/60 backdrop-blur-md px-6 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-4">
            <span className="font-outfit font-bold text-base text-white tracking-wide">D-Stack App Workspace</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative w-56 sm:w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar recursos..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Notifications Icon */}
            <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors relative shrink-0">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
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
