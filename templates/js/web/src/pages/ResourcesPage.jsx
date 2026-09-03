import React, { useState, useEffect, useMemo } from 'react';
import { ApexTable } from 'react-apextable-pro';
import { formatCurrency } from 'intl-currency-helper';
import { 
  Plus, Trash2, RefreshCw, Database, CheckCircle2, Edit3, X, Archive,
  DollarSign, Package, Layers
} from 'lucide-react';
import { api } from '../api/client';

export default function ResourcesPage() {
  const [items, setItems] = useState([
    { id: '1', code: 'REC-001', name: 'Servidor Principal API', category: 'Backend', price: 1250.50, currency: 'USD', status: 1, date: '2026-07-24' },
    { id: '2', code: 'REC-002', name: 'Cliente Fluent REST', category: 'Frontend', price: 499.00, currency: 'USD', status: 1, date: '2026-07-24' },
    { id: '3', code: 'REC-003', name: 'Esquema de Validación Zod', category: 'Seguridad', price: 150.00, currency: 'USD', status: 1, date: '2026-07-23' },
    { id: '4', code: 'REC-004', name: 'Plugin Mongoose SoftDelete', category: 'Base de Datos', price: 24900.00, currency: 'MXN', status: 0, date: '2026-07-22' },
  ]);

  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('active');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form inputs
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [price, setPrice] = useState('250.00');
  const [currency, setCurrency] = useState('USD');

  // Fetch Resources from Mongo via fluent-rest-client
  useEffect(() => {
    api.resource('resources').safe().get()
      .then((res) => {
        if (res.ok && Array.isArray(res.data)) {
          setItems(res.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Kpi metrics calculation
  const activeItems = useMemo(() => items.filter(i => i.status === 1), [items]);
  const deletedItems = useMemo(() => items.filter(i => i.status === 0), [items]);
  const totalValue = useMemo(() => activeItems.reduce((acc, curr) => acc + (curr.price || 0), 0), [activeItems]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setName('');
    setCategory('General');
    setPrice('250.00');
    setCurrency('USD');
    setShowCreateModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category || 'General');
    setPrice(String(item.price || 0));
    setCurrency(item.currency || 'USD');
    setShowEditModal(true);
  };

  // Insert Record
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseFloat(price) || 0;

    try {
      const res = await api.resource('resources').safe().post({
        name: name.trim(),
        category,
        price: parsedPrice,
        currency,
      });

      if (res.ok && res.data) {
        setItems([res.data, ...items]);
      } else {
        const newItem = {
          id: String(Date.now()),
          code: `REC-00${items.length + 1}`,
          name: name.trim(),
          category,
          price: parsedPrice,
          currency,
          status: 1,
          date: new Date().toISOString().split('T')[0],
        };
        setItems([newItem, ...items]);
      }
    } catch {
      const newItem = {
        id: String(Date.now()),
        code: `REC-00${items.length + 1}`,
        name: name.trim(),
        category,
        price: parsedPrice,
        currency,
        status: 1,
        date: new Date().toISOString().split('T')[0],
      };
      setItems([newItem, ...items]);
    }

    setShowCreateModal(false);
  };

  // Edit / Modify Record
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem || !name.trim()) return;

    const id = editingItem._id || editingItem.id;
    const parsedPrice = parseFloat(price) || 0;

    try {
      await api.resource(`resources/${id}`).safe().put({
        name: name.trim(),
        category,
        price: parsedPrice,
        currency,
      });
    } catch {}

    setItems(items.map(item => (item._id === id || item.id === id) ? {
      ...item,
      name: name.trim(),
      category,
      price: parsedPrice,
      currency,
    } : item));

    setShowEditModal(false);
    setEditingItem(null);
  };

  // Soft Delete Record (1 -> 0) - Disappears from active table
  const handleSoftDelete = async (targetItem) => {
    const id = targetItem._id || targetItem.id;
    if (!id) return;

    try {
      await api.resource(`resources/${id}`).safe().delete();
    } catch {}

    setItems(items.map(item => (item._id === id || item.id === id) ? { ...item, status: 0 } : item));
  };

  // Restore Record (0 -> 1)
  const handleRestore = async (targetItem) => {
    const id = targetItem._id || targetItem.id;
    if (!id) return;

    try {
      await api.resource(`resources/${id}/restore`).safe().patch({});
    } catch {}

    setItems(items.map(item => (item._id === id || item.id === id) ? { ...item, status: 1 } : item));
  };

  // Filter items: Active items (status === 1) by default!
  const displayedItems = filterMode === 'active' ? activeItems : deletedItems;

  // Table Columns
  const columnas = [
    {
      name: 'Código / ID',
      selector: row => row.code,
      sortable: true,
      cell: row => (
        <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md text-xs tracking-wider">
          {row.code}
        </span>
      )
    },
    {
      name: 'Nombre del Recurso',
      selector: row => row.name,
      sortable: true,
      cell: row => <span className="font-semibold text-slate-100 text-sm tracking-wide">{row.name}</span>
    },
    {
      name: 'Categoría',
      selector: row => row.category,
      sortable: true,
      cell: row => (
        <span className="bg-slate-800/90 text-slate-300 border border-slate-700/80 px-3 py-1 rounded-full text-xs font-semibold">
          {row.category}
        </span>
      )
    },
    {
      name: 'Precio (intl-currency-helper)',
      selector: row => row.price,
      sortable: true,
      cell: row => (
        <span className="font-mono text-emerald-300 font-bold bg-emerald-950/90 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs tracking-wider shadow-sm">
          {formatCurrency(row.price || 0, { currency: row.currency || 'USD' })}
        </span>
      )
    },
    {
      name: 'Estado',
      selector: row => row.status,
      sortable: true,
      cell: row => (
        row.status === 1 ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 size={14} /> Activo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/40">
            <Archive size={14} /> Papelera
          </span>
        )
      )
    },
    {
      name: 'Acciones (CRUD)',
      right: true,
      cell: row => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 1 ? (
            <>
              <button
                onClick={() => handleOpenEdit(row)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ffd000]/10 hover:bg-[#ffd000]/20 border border-[#ffd000]/30 text-[#ffd000] text-xs font-semibold transition-colors cursor-pointer"
                title="Modificar Recurso"
              >
                <Edit3 size={13} />
                <span>Editar</span>
              </button>

              <button
                onClick={() => handleSoftDelete(row)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f43f5e]/10 hover:bg-[#f43f5e]/20 border border-[#f43f5e]/30 text-[#f43f5e] text-xs font-semibold transition-colors cursor-pointer"
                title="Eliminación Lógica (status: 1 -> 0)"
              >
                <Trash2 size={13} />
                <span>Eliminar</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => handleRestore(row)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10b981]/10 hover:bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] text-xs font-semibold transition-colors cursor-pointer"
              title="Restaurar (status: 0 -> 1)"
            >
              <RefreshCw size={13} />
              <span>Restaurar</span>
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Hero Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#0e1117] border border-[#1c222d] p-6 sm:p-7 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#ffd000]/10 border border-[#ffd000]/30 text-[#ffd000] text-xs font-mono font-semibold">
              <Layers size={13} />
              <span>MÓDULO MONOLITO CRUD</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Gestión de Recursos y Finanzas
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Administración completa con inserción modal, modificación, eliminación lógica (soft delete) e integración de las 3 librerías de David Franco.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Active vs Deleted Filter Pills */}
            <div className="flex bg-[#07090d] p-1 rounded-lg border border-[#1c222d] text-xs font-mono shadow-inner">
              <button
                onClick={() => setFilterMode('active')}
                className={`px-3 py-1.5 rounded-md transition-colors ${filterMode === 'active' ? 'bg-[#ffd000]/15 text-[#ffd000] border border-[#ffd000]/30 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Activos ({activeItems.length})
              </button>
              <button
                onClick={() => setFilterMode('deleted')}
                className={`px-3 py-1.5 rounded-md transition-colors ${filterMode === 'deleted' ? 'bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Papelera ({deletedItems.length})
              </button>
            </div>

            {/* Trigger Insert Modal */}
            <button
              onClick={handleOpenCreate}
              className="py-2 px-4 text-xs font-bold rounded-md bg-[#ffd000] hover:bg-[#ffe45e] text-black shadow-md shadow-[#ffd000]/20 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>Nuevo Recurso</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border border-[#1c222d] rounded-xl bg-[#0e1117] flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">Valor Total Activo</span>
            <p className="font-display font-bold text-2xl text-[#10b981]">
              {formatCurrency(totalValue, { currency: 'USD' })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="p-5 border border-[#1c222d] rounded-xl bg-[#0e1117] flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">Recursos Activos</span>
            <p className="font-display font-bold text-2xl text-[#ffd000]">{activeItems.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#ffd000]/10 border border-[#ffd000]/20 text-[#ffd000] flex items-center justify-center">
            <Package size={20} />
          </div>
        </div>

        <div className="p-5 border border-[#1c222d] rounded-xl bg-[#0e1117] flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">En Papelera</span>
            <p className="font-display font-bold text-2xl text-[#f43f5e]">{deletedItems.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#f43f5e] flex items-center justify-center">
            <Archive size={20} />
          </div>
        </div>
      </div>

      {/* Main Table Grid Card */}
      <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-lg text-white">Listado de Recursos ({filterMode === 'active' ? 'Activos' : 'Papelera'})</h2>
            <p className="text-xs text-slate-400">Tabla interactiva con persistencia de columnas y paginación rápida</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#ffd000] bg-[#ffd000]/10 border border-[#ffd000]/20 px-2 py-0.5 rounded">
              react-apextable-pro
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-mono">Cargando base de datos MongoDB...</div>
        ) : (
          <ApexTable
            datos={filterMode === 'active' ? activeItems : deletedItems}
            columnas={columnas}
            storagePrefix="dstack_resources_"
            pagination
          />
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 border border-[#1c222d] rounded-xl shadow-2xl relative bg-[#0e1117]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#1c222d]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ffd000]/10 text-[#ffd000] flex items-center justify-center border border-[#ffd000]/25">
                  <Plus size={15} />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Crear Nuevo Recurso</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/[0.05] transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Nombre del Recurso</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Servidor de Caché Redis"
                  className="form-input pl-3 bg-[#07090d] text-white border border-[#1c222d] rounded-md text-xs focus:border-[#ffd000]"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input pl-3 bg-[#07090d] text-white border border-[#1c222d] rounded-md text-xs focus:border-[#ffd000]"
                >
                  <option value="General">General</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Base de Datos">Base de Datos</option>
                  <option value="Seguridad">Seguridad</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 form-group">
                  <label className="form-label">Precio / Monto</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="250.00"
                    className="form-input pl-3 bg-[#07090d] text-white border border-[#1c222d] rounded-md text-xs focus:border-[#ffd000]"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Moneda</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="form-input pl-2 bg-[#07090d] text-white border border-[#1c222d] rounded-md text-xs focus:border-[#ffd000]"
                  >
                    <option value="USD">USD</option>
                    <option value="MXN">MXN</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#1c222d] mt-5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-md text-xs font-semibold text-slate-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button type="submit" className="py-2 px-5 text-xs font-bold rounded-md bg-[#ffd000] hover:bg-[#ffe45e] text-black shadow-md shadow-[#ffd000]/20 transition-colors cursor-pointer">
                  Guardar Recurso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 border border-[#1c222d] rounded-xl shadow-2xl relative bg-[#0e1117]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#1c222d]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ffd000]/10 text-[#ffd000] flex items-center justify-center border border-[#ffd000]/25">
                  <Edit3 size={15} />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Modificar Recurso</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/[0.05] transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Nombre del Recurso</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input pl-3 bg-[#07090d] text-white border border-[#1c222d] rounded-md text-xs focus:border-[#ffd000]"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input pl-3 bg-[#07090d] text-white border border-[#1c222d] rounded-md text-xs focus:border-[#ffd000]"
                >
                  <option value="General">General</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Base de Datos">Base de Datos</option>
                  <option value="Seguridad">Seguridad</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 form-group">
                  <label className="form-label">Precio / Monto</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-input pl-3 bg-[#07090d] text-white border border-[#1c222d] rounded-md text-xs focus:border-[#ffd000]"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Moneda</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="form-input pl-2 bg-[#07090d] text-white border border-[#1c222d] rounded-md text-xs focus:border-[#ffd000]"
                  >
                    <option value="USD">USD</option>
                    <option value="MXN">MXN</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#1c222d] mt-5">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-md text-xs font-semibold text-slate-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button type="submit" className="py-2 px-5 text-xs font-bold rounded-md bg-[#ffd000] hover:bg-[#ffe45e] text-black shadow-md shadow-[#ffd000]/20 transition-colors cursor-pointer">
                  Actualizar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
