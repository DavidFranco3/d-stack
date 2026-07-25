import React from 'react';
import { ApexTable } from 'react-apextable-pro';
import { Users, Shield, UserCheck } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { id: 'USR-001', name: 'Admin', email: 'admin@dstack.com', role: 'Administrador', status: 1 },
    { id: 'USR-002', name: 'Dev User', email: 'dev@dstack.com', role: 'Desarrollador', status: 1 },
  ];

  const columnas = [
    { name: 'ID', selector: row => row.id, sortable: true, cell: row => <span className="font-mono text-indigo-400 font-semibold">{row.id}</span> },
    { name: 'Nombre', selector: row => row.name, sortable: true, cell: row => <span className="font-semibold text-white">{row.name}</span> },
    { name: 'Email', selector: row => row.email, sortable: true, cell: row => <span className="text-slate-300 font-mono">{row.email}</span> },
    { name: 'Rol', selector: row => row.role, cell: row => <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-md text-xs font-semibold">{row.role}</span> },
    { name: 'Estado', cell: row => <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1"><UserCheck size={14} /> Activo (1)</span> }
  ];

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
        <div>
          <h2 className="font-outfit font-bold text-xl text-white flex items-center gap-2">
            <Users size={22} className="text-indigo-400" />
            Gestión de Usuarios
          </h2>
          <p className="text-xs text-slate-400 mt-1">Lista de usuarios autenticados y roles del monolito</p>
        </div>
        <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
          <Shield size={14} />
          <span>Acceso Restringido</span>
        </span>
      </div>

      <div className="glass rounded-2xl border border-white/5 p-4">
        <ApexTable datos={users} columnas={columnas} storagePrefix="dstack_users_" pagination />
      </div>
    </div>
  );
}
