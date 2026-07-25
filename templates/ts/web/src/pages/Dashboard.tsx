import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, LayoutDashboard, Database, Users, Settings, LogOut, 
  Search, Bell, Plus, CheckCircle2, MoreVertical, Trash2, Edit3, X 
} from 'lucide-react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

interface Item {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'pending';
  date: string;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'items' | 'users' | 'settings'>('dashboard');
  const [apiStatus, setApiStatus] = useState<string>('Comprobando...');
  const [isHealthy, setIsHealthy] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('General');
  
  const navigate = useNavigate();

  // Sample App Data State
  const [items, setItems] = useState<Item[]>([
    { id: 'REC-001', name: 'Servidor Principal API', category: 'Backend', status: 'active', date: '2026-07-24' },
    { id: 'REC-002', name: 'Cliente Fluent REST', category: 'Frontend', status: 'active', date: '2026-07-24' },
    { id: 'REC-003', name: 'Esquema de Validación Zod', category: 'Seguridad', status: 'active', date: '2026-07-23' },
    { id: 'REC-004', name: 'Plugin Mongoose SoftDelete', category: 'Base de Datos', status: 'pending', date: '2026-07-22' },
  ]);

  useEffect(() => {
    api.resource('health').safe().get()
      .then((res: any) => {
        if (res.ok && res.data) {
          setApiStatus('API Conectada (200 OK)');
          setIsHealthy(true);
        } else {
          setApiStatus('Error de conexión');
          setIsHealthy(false);
        }
      })
      .catch(() => {
        setApiStatus('Desconectado');
        setIsHealthy(false);
      });
  }, []);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: Item = {
      id: `REC-00${items.length + 1}`,
      name: newItemName,
      category: newItemCategory,
      status: 'active',
      date: new Date().toISOString().split('T')[0],
    };

    setItems([newItem, ...items]);
    setNewItemName('');
    setShowModal(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#0a0c10] text-slate-100 overflow-hidden font-inter">
      {/* Sidebar Left Navigation */}
      <aside className="w-64 bg-[#12161f]/80 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between p-4 z-20 shrink-0">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Rocket size={22} color="white" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-lg text-white leading-none">D-Stack App</h1>
              <span className="text-[11px] text-indigo-400 font-medium tracking-wide">PANEL DE CONTROL</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Panel Principal</span>
            </button>

            <button 
              onClick={() => setActiveTab('items')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'items' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database size={18} />
              <span>Recursos & Datos</span>
              <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono">{items.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={18} />
              <span>Usuarios</span>
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings size={18} />
              <span>Configuración</span>
            </button>
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-outfit shrink-0">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'David Admin'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@dstack.com'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogoutClick}
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0"
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main App Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="grid-bg" />

        {/* Topbar Header */}
        <header className="h-16 border-b border-white/5 bg-[#12161f]/40 backdrop-blur-md px-6 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-outfit font-bold text-xl text-white">
              {activeTab === 'dashboard' && 'Panel Principal'}
              {activeTab === 'items' && 'Gestión de Recursos'}
              {activeTab === 'users' && 'Gestión de Usuarios'}
              {activeTab === 'settings' && 'Configuración de la App'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar datos o recursos..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Action Modal Trigger */}
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary py-2 px-3.5 text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>Nuevo Recurso</span>
            </button>

            {/* Notifications Icon */}
            <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors relative">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Recursos</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Database size={18} />
                </div>
              </div>
              <div className="text-2xl font-bold font-outfit text-white mb-1">{items.length}</div>
              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <span>+12% esta semana</span>
              </div>
            </div>

            <div className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estado API Backend</span>
                <div className={`w-8 h-8 rounded-lg ${isHealthy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'} flex items-center justify-center`}>
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="text-sm font-bold font-outfit text-white mb-1 truncate">{apiStatus}</div>
              <div className="text-xs text-slate-400 font-mono">http://localhost:4000</div>
            </div>

            <div className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Usuarios Registrados</span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <div className="text-2xl font-bold font-outfit text-white mb-1">1</div>
              <div className="text-xs text-slate-400">Admin Seeder Activo</div>
            </div>

            <div className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cliente REST</span>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Rocket size={18} />
                </div>
              </div>
              <div className="text-sm font-bold font-outfit text-white mb-1">fluent-rest-client</div>
              <div className="text-xs text-cyan-400 font-mono">v1.0.0 activo</div>
            </div>
          </div>

          {/* Application Data Table Section */}
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-outfit font-bold text-lg text-white">Listado de Recursos de la Aplicación</h3>
                <p className="text-xs text-slate-400 mt-0.5">Gestión en tiempo real de los datos de tu monolito D-Stack</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Filtrar:</span>
                <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none">
                  <option value="all" className="bg-[#12161f]">Todos</option>
                  <option value="active" className="bg-[#12161f]">Activos</option>
                  <option value="pending" className="bg-[#12161f]">Pendientes</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.02] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-6">ID / Código</th>
                    <th className="py-3.5 px-6">Nombre del Recurso</th>
                    <th className="py-3.5 px-6">Categoría</th>
                    <th className="py-3.5 px-6">Estado</th>
                    <th className="py-3.5 px-6">Fecha Registro</th>
                    <th className="py-3.5 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-6 font-mono text-indigo-400 font-medium">{item.id}</td>
                      <td className="py-4 px-6 font-semibold text-white">{item.name}</td>
                      <td className="py-4 px-6">
                        <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-[11px] text-slate-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {item.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-mono">{item.date}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100">
                          <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Editar">
                            <Edit3 size={15} />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors" 
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredItems.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No se encontraron recursos que coincidan con la búsqueda.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create New Item Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 relative border border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/10">
                <h3 className="font-outfit font-bold text-lg text-white">Agregar Nuevo Recurso</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="form-group mb-3">
                  <label className="form-label">Nombre del Recurso</label>
                  <input 
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Ej. Controlador de Usuarios"
                    className="form-input pl-4"
                    required
                  />
                </div>

                <div className="form-group mb-5">
                  <label className="form-label">Categoría</label>
                  <select 
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="form-input pl-4 bg-[#12161f] text-white"
                  >
                    <option value="General">General</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Base de Datos">Base de Datos</option>
                    <option value="Seguridad">Seguridad</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-white/5"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary py-2 px-4 text-xs rounded-xl"
                  >
                    Guardar Recurso
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
