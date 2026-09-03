import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Database, Server, Users, Table, ArrowRight, BookOpen, 
  Cpu
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#0e1117] border border-[#1c222d] p-7 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#ffd000]/10 border border-[#ffd000]/30 text-[#ffd000] text-[11px] font-mono font-semibold tracking-wide">
              <Zap size={13} className="text-[#ffd000]" />
              <span>MONOLITO EXPRESS + REACT 19</span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
              Workspace <span className="text-[#ffd000]">D-Stack Engine</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Arquitectura monolítica con inyección automática de rutas, validación Zod, sesiones seguras por cookies y CRUD con React 19.
            </p>

            {/* Health Status Indicator */}
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#07090d] border border-[#1c222d] text-xs font-mono">
                <span className={`w-2 h-2 rounded-full ${apiStatus.ok ? 'bg-[#10b981] shadow-[0_0_8px_#10b981]' : 'bg-[#f43f5e]'}`} />
                <span className="text-slate-400">Backend API:</span>
                <span className={apiStatus.ok ? 'text-[#10b981] font-semibold' : 'text-[#f43f5e] font-semibold'}>
                  {apiStatus.ok ? '200 OK (mongodb://127.0.0.1:27017)' : 'Desconectado'}
                </span>
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
            <button
              onClick={() => navigate('/resources')}
              className="py-2.5 px-5 text-xs font-bold rounded-md bg-[#ffd000] hover:bg-[#ffe45e] text-black shadow-md shadow-[#ffd000]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Ir al Módulo CRUD</span>
              <ArrowRight size={15} />
            </button>

            <a
              href="https://github.com/DavidFranco3/d-stack"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-5 text-xs font-semibold rounded-md bg-[#131720] hover:bg-[#1a202c] text-slate-300 border border-[#242b39] flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen size={15} />
              <span>Documentación</span>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-5 hover:border-[#364154] transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Recursos CRUD</span>
            <div className="w-8 h-8 rounded bg-[#ffd000]/10 text-[#ffd000] flex items-center justify-center border border-[#ffd000]/25">
              <Database size={16} />
            </div>
          </div>
          <p className="font-display font-bold text-2xl text-white mb-0.5">{resourceCount}</p>
          <span className="text-[11px] text-[#ffd000] font-mono">Soft Delete Activo (1/0)</span>
        </div>

        <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-5 hover:border-[#364154] transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Estado API</span>
            <div className="w-8 h-8 rounded bg-[#10b981]/10 text-[#10b981] flex items-center justify-center border border-[#10b981]/25">
              <Server size={16} />
            </div>
          </div>
          <p className="font-display font-bold text-xl text-[#10b981] mb-0.5">200 OK</p>
          <span className="text-[11px] text-slate-400 font-mono">http://localhost:4000</span>
        </div>

        <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-5 hover:border-[#364154] transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Usuarios</span>
            <div className="w-8 h-8 rounded bg-[#a855f7]/10 text-[#c084fc] flex items-center justify-center border border-[#a855f7]/25">
              <Users size={16} />
            </div>
          </div>
          <p className="font-display font-bold text-2xl text-white mb-0.5">1</p>
          <span className="text-[11px] text-slate-400 font-mono truncate block">admin@dstack.com</span>
        </div>

        <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-5 hover:border-[#364154] transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Data Grid</span>
            <div className="w-8 h-8 rounded bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center border border-[#38bdf8]/25">
              <Table size={16} />
            </div>
          </div>
          <p className="font-display font-bold text-base text-white mb-0.5">react-apextable-pro</p>
          <span className="text-[11px] text-[#38bdf8] font-mono">React 19 Ready</span>
        </div>
      </div>

      {/* Main Feature Cards Grid (Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Package Ecosystem Showcase (2 Columns) */}
        <div className="lg:col-span-2 bg-[#0e1117] border border-[#1c222d] rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c222d]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#ffd000] flex items-center justify-center text-black">
                <Zap size={16} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Librerías Preintegradas</h3>
                <p className="text-xs text-slate-400">Ecosistema oficial integrado por defecto</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-[#07090d] border border-[#1c222d] space-y-1.5 hover:border-[#364154] transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#ffd000]">fluent-rest-client</span>
                <span className="text-[10px] bg-[#181d28] text-slate-300 font-mono px-1.5 py-0.5 rounded border border-[#242b39]">v1.1.0</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cliente HTTP fluido con builder pattern y gestión de cookies/tokens.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#07090d] border border-[#1c222d] space-y-1.5 hover:border-[#364154] transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#38bdf8]">react-apextable-pro</span>
                <span className="text-[10px] bg-[#181d28] text-slate-300 font-mono px-1.5 py-0.5 rounded border border-[#242b39]">v1.0.3</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grid de datos con ordenación, persistencia y exportación CSV.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#07090d] border border-[#1c222d] space-y-1.5 hover:border-[#364154] transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#10b981]">intl-currency-helper</span>
                <span className="text-[10px] bg-[#181d28] text-slate-300 font-mono px-1.5 py-0.5 rounded border border-[#242b39]">v2.0.0</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Formateador monetario multimoneda con soporte para USD, MXN y EUR.
              </p>
            </div>
          </div>
        </div>

        {/* Stack Status & System Info (1 Column) */}
        <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#1c222d]">
            <div className="w-8 h-8 rounded bg-[#10b981]/10 text-[#10b981] flex items-center justify-center border border-[#10b981]/25">
              <Cpu size={16} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Stack Tecnológico</h3>
              <p className="text-xs text-slate-400">Versiones LTS activas</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-[#07090d] border border-[#1c222d]">
              <span className="text-slate-400 font-medium">React & DOM</span>
              <span className="font-mono font-bold text-[#38bdf8]">v19.2.8</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#07090d] border border-[#1c222d]">
              <span className="text-slate-400 font-medium">Vite Engine</span>
              <span className="font-mono font-bold text-[#ffd000]">v8.1.5</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#07090d] border border-[#1c222d]">
              <span className="text-slate-400 font-medium">Express API</span>
              <span className="font-mono font-bold text-[#10b981]">v4.22.1</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#07090d] border border-[#1c222d]">
              <span className="text-slate-400 font-medium">MongoDB Mongoose</span>
              <span className="font-mono font-bold text-[#38bdf8]">v8.10.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
