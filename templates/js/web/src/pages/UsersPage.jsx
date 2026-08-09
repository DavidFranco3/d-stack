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
  background: '#12161f',
  color: '#ffffff',
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
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#12161f',
      color: '#ffffff',
    });

    if (result.isConfirmed) {
      setUsers(users.filter(u => u._id !== user._id && u.id !== user.id));
      Toast.fire({ icon: 'success', title: 'Usuario eliminado' });
    }
  };

  const columnas = [
    { name: 'ID', selector: row => row._id || row.id || '', sortable: true, cell: row => <span className="font-mono text-cyan-400 font-semibold">{row._id || row.id}</span> },
    { name: 'Nombre', selector: row => row.name, sortable: true, cell: row => <span className="font-semibold text-white">{row.name}</span> },
    { name: 'Email', selector: row => row.email, sortable: true, cell: row => <span className="text-slate-300 font-mono">{row.email}</span> },
    { name: 'Rol', selector: row => row.role, cell: row => <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded-md text-xs font-semibold">{row.role}</span> },
    { name: 'Estado', cell: row => <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1"><UserCheck size={14} /> Activo ({row.status || 1})</span> },
    {
      name: 'Acciones',
      cell: row => (
        <Dropdown>
          <Dropdown.Trigger />
          <Dropdown.Content>
            <Dropdown.Item onClick={() => handleOpenEdit(row)} className="text-cyan-300">
              <Edit2 size={15} /> Editar
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleDelete(row)} className="text-rose-400">
              <Trash2 size={15} /> Eliminar
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#12161f]/90 p-6 rounded-3xl border border-white/10 flex items-center justify-between shadow-2xl">
        <div>
          <h2 className="font-outfit font-bold text-xl text-white flex items-center gap-2">
            <Users size={22} className="text-cyan-400" />
            Gestión de Usuarios
          </h2>
          <p className="text-xs text-slate-400 mt-1">Administración de usuarios, cuentas y roles del monolito</p>
        </div>
        <button onClick={handleOpenCreate} className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition flex items-center gap-2">
          <Plus size={16} /> Nuevo Usuario
        </button>
      </div>

      <div className="bg-[#12161f]/90 rounded-3xl border border-white/10 p-6 shadow-2xl">
        <ApexTable datos={users} columnas={columnas} storagePrefix="dstack_users_" pagination />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#12161f] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Nombre Completo</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#1a202c] text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500" placeholder="Ej. Ana Franco" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Correo Electrónico</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#1a202c] text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500" placeholder="usuario@dstack.com" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#1a202c] text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500" placeholder={editingUser ? 'Dejar en blanco para mantener' : '••••••••'} />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Rol de Usuario</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-[#1a202c] text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500">
                  <option value="Administrador">Administrador</option>
                  <option value="Desarrollador">Desarrollador</option>
                  <option value="Usuario">Usuario</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition">
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
