import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, Database, Server, Users, Table, ArrowRight, BookOpen, 
  CheckCircle2, Cpu, ShieldCheck, Zap
} from 'lucide-react';
import { api } from '../api/client';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState<{ ok: boolean; message: string }>({ ok: false, message: 'Conectando...' });
  const [resourceCount, setResourceCount] = useState(4);

  useEffect(() => {
    // Check API status via fluent-rest-client
    api.resource('').safe().get()
      .then((res: any) => {
        if (res.ok) {
          setApiStatus({ ok: true, message: res.data?.message || 'D-Stack API is running' });
        } else {
          setApiStatus({ ok: false, message: 'API Off' });
        }
      })
      .catch(() => setApiStatus({ ok: false, message: 'Error de Conexión' }));

    // Fetch resources count
    api.resource('resources').safe().get()
      .then((res: any) => {
        if (res.ok && Array.isArray(res.data)) {
          setResourceCount(res.data.length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 border border-white/10 p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide">
              <Zap size={14} className="text-indigo-400 fill-indigo-400/20" />
              <span>MONOLITO FULLSTACK EXPRESS + REACT 19</span>
            </div>

            <h1 className="font-outfit font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              Bienvenido al Workspace <span className="gradient-text">D-Stack</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Monolito profesional preconfigurado con autenticación JWT, MongoDB Mongoose, servidor Vite 8 de alta velocidad y el ecosistema de librerías de David Franco.
            </p>

            {/* Health Status Indicator */}
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono">
                <span className={`w-2.5 h-2.5 rounded-full ${apiStatus.ok ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-slate-300">Backend API:</span>
                <span className={apiStatus.ok ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {apiStatus.ok ? '200 OK (mongodb://localhost:27017)' : 'Desconectado'}
                </span>
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => navigate('/resources')}
              className="py-3 px-6 text-xs font-bold rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Ir al Módulo CRUD</span>
              <ArrowRight size={16} />
            </button>

            <a
              href="https://github.com/DavidFranco3/d-stack"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-6 text-xs font-bold rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center justify-center gap-2 transition-all"
            >
              <BookOpen size={16} />
              <span>Ver Documentación</span>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#12161f]/90 border border-white/10 rounded-2xl p-5 shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recursos CRUD</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Database size={20} />
            </div>
          </div>
          <p className="font-outfit font-extrabold text-3xl text-white mb-1">{resourceCount}</p>
          <span className="text-xs text-indigo-400 font-medium">Con Soft Delete (Estatus 1 / 0)</span>
        </div>

        <div className="bg-[#12161f]/90 border border-white/10 rounded-2xl p-5 shadow-xl hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado Backend</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Server size={20} />
            </div>
          </div>
          <p className="font-outfit font-extrabold text-xl text-emerald-400 mb-1">Conectado (200 OK)</p>
          <span className="text-xs text-slate-400 font-medium">http://localhost:4000</span>
        </div>

        <div className="bg-[#12161f]/90 border border-white/10 rounded-2xl p-5 shadow-xl hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuarios Registrados</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Users size={20} />
            </div>
          </div>
          <p className="font-outfit font-extrabold text-3xl text-white mb-1">2</p>
          <span className="text-xs text-purple-400 font-medium">Admin (admin@dstack.com)</span>
        </div>

        <div className="bg-[#12161f]/90 border border-white/10 rounded-2xl p-5 shadow-xl hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Grid Engine</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Table size={20} />
            </div>
          </div>
          <p className="font-outfit font-bold text-lg text-white mb-1">react-apextable-pro</p>
          <span className="text-xs text-cyan-400 font-medium font-mono">v1.0.3 activa en npm</span>
        </div>
      </div>

      {/* Main Feature Cards Grid (Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Package Ecosystem Showcase (2 Columns) */}
        <div className="lg:col-span-2 bg-[#12161f]/90 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Rocket size={20} />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-lg text-white">Ecosistema Integrado de Librerías</h3>
                <p className="text-xs text-slate-400">Publicado por David Franco en npm</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400">fluent-rest-client</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">v1.0.0</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cliente HTTP fluido orientado a objetos para realizar peticiones REST sencillas a Express.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-400">react-apextable-pro</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">v1.0.3</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tabla de datos profesional con soporte nativo para React 19, columnas fijas y exportación.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400">intl-currency-helper</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">v2.0.0</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Formateador automático de divisas multimoneda (`USD`, `MXN`, `EUR`) basado en la API Intl.
              </p>
            </div>
          </div>
        </div>

        {/* Stack Status & System Info (1 Column) */}
        <div className="bg-[#12161f]/90 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-lg text-white">Stack de Producción</h3>
              <p className="text-xs text-slate-400">Tecnologías de Última Generación</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400 font-medium">React & DOM</span>
              <span className="font-mono font-bold text-indigo-400">v19.2.8</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400 font-medium">Vite Engine</span>
              <span className="font-mono font-bold text-indigo-400">v8.1.5</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400 font-medium">Tailwind CSS</span>
              <span className="font-mono font-bold text-indigo-400">v4.3.3</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400 font-medium">Express API</span>
              <span className="font-mono font-bold text-indigo-400">v4.21.2</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400 font-medium">MongoDB Mongoose</span>
              <span className="font-mono font-bold text-indigo-400">v8.10.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
