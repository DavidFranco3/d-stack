import { useState, useEffect } from 'react';
import { ApexTable } from 'react-apextable-pro';
import { Users, Plus, Edit2, Trash2, UserCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import Dropdown from '../components/Dropdown';
import { api } from '../api/client';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#0e1117',
  color: '#f8fafc',
});

export default function UsersPage() {
  const [users, setUsers] = useState([
    { _id: 'USR-001', name: 'Admin', email: 'admin@dstack.com', role: 'Administrador', status: 1 },
    { _id: 'USR-002', name: 'Dev User', email: 'dev@dstack.com', role: 'Desarrollador', status: 1 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Desarrollador');

  const fetchUsers = async () => {
    try {
      const res = await api.resource('users').safe().get();
      if (res.ok && res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
        if (list.length > 0) setUsers(list);
      }
    } catch {
      // Keep default users if offline
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('Desarrollador');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setRole(user.role);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingUser) {
      const updated = users.map(u => (u._id === editingUser._id || u.id === editingUser.id ? { ...u, name, email, role } : u));
      setUsers(updated);
      Toast.fire({ icon: 'success', title: 'Usuario actualizado correctamente' });
    } else {
      const newUser = {
        _id: `USR-00${users.length + 1}`,
        name,
        email,
        role,
        status: 1,
      };
      setUsers([...users, newUser]);
      Toast.fire({ icon: 'success', title: 'Usuario registrado con éxito' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `¿Estás seguro de deshabilitar a ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#1e2430',
      confirmButtonText: 'Sí, deshabilitar',
      cancelButtonText: 'Cancelar',
      background: '#0e1117',
      color: '#ffffff',
    });

    if (result.isConfirmed) {
      setUsers(users.filter(u => (u._id || u.id) !== (user._id || user.id)));
      Toast.fire({ icon: 'success', title: 'Usuario deshabilitado' });
    }
  };

  const columnas = [
    { name: 'Identificador', selector: row => row._id || row.id || '-', cell: row => <span className="font-mono text-xs text-slate-400">{row._id || row.id}</span> },
    { name: 'Nombre', selector: row => row.name, sortable: true, cell: row => <span className="font-semibold text-white text-xs">{row.name}</span> },
    { name: 'Correo Electrónico', selector: row => row.email, sortable: true, cell: row => <span className="font-mono text-slate-300 text-xs">{row.email}</span> },
    { name: 'Rol', selector: row => row.role, cell: row => <span className="bg-[#181d28] text-[#38bdf8] border border-[#242b39] px-2 py-0.5 rounded text-xs font-mono font-semibold">{row.role}</span> },
    { name: 'Estado', cell: row => <span className="text-[#10b981] font-mono text-xs flex items-center gap-1"><UserCheck size={13} /> Activo ({row.status || 1})</span> },
    {
      name: 'Acciones',
      cell: row => (
        <Dropdown>
          <Dropdown.Trigger />
          <Dropdown.Content>
            <Dropdown.Item onClick={() => handleOpenEdit(row)} className="text-[#ffd000]">
              <Edit2 size={13} /> Editar
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleDelete(row)} className="text-[#f43f5e]">
              <Trash2 size={13} /> Deshabilitar
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="bg-[#0e1117] p-6 rounded-xl border border-[#1c222d] flex items-center justify-between shadow-2xl">
        <div>
          <h1 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Users size={20} className="text-[#ffd000]" />
            Gestión de Usuarios
          </h1>
          <p className="text-xs text-slate-400 mt-1">Administración de usuarios, cuentas y roles del monolito</p>
        </div>
        <button onClick={handleOpenCreate} className="px-4 py-2 bg-[#ffd000] hover:bg-[#ffe45e] text-black font-bold text-xs rounded-md shadow-sm transition-colors flex items-center gap-2 cursor-pointer">
          <Plus size={15} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="bg-[#0e1117] rounded-xl border border-[#1c222d] p-6 shadow-2xl">
        <ApexTable datos={users} columnas={columnas} storagePrefix="dstack_users_" pagination />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-display font-bold text-white mb-4">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1 uppercase tracking-wider">Nombre Completo</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#07090d] text-white px-3.5 py-2 text-xs rounded-md border border-[#1c222d] focus:outline-none focus:border-[#ffd000]" placeholder="Ej. Ana Franco" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1 uppercase tracking-wider">Correo Electrónico</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#07090d] text-white px-3.5 py-2 text-xs rounded-md border border-[#1c222d] focus:outline-none focus:border-[#ffd000]" placeholder="usuario@dstack.com" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1 uppercase tracking-wider">Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#07090d] text-white px-3.5 py-2 text-xs rounded-md border border-[#1c222d] focus:outline-none focus:border-[#ffd000]" placeholder={editingUser ? 'Dejar en blanco para mantener' : '••••••••'} />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1 uppercase tracking-wider">Rol de Usuario</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-[#07090d] text-white px-3 py-2 text-xs rounded-md border border-[#1c222d] focus:outline-none focus:border-[#ffd000]">
                  <option value="Administrador">Administrador</option>
                  <option value="Desarrollador">Desarrollador</option>
                  <option value="Usuario">Usuario</option>
                </select>
              </div>
              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#1c222d] mt-5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-2 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#ffd000] hover:bg-[#ffe45e] text-black font-bold text-xs rounded-md transition-colors cursor-pointer">
                  {editingUser ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
