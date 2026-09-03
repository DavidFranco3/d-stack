import React from 'react';
import { Settings, ShieldCheck, Globe, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="bg-[#0e1117] p-6 rounded-xl border border-[#1c222d] shadow-2xl">
        <h1 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <Settings size={20} className="text-[#ffd000]" />
          Configuración del Monolito
        </h1>
        <p className="text-xs text-slate-400 mt-1">Parámetros del sistema D-Stack y módulos integrados</p>
      </div>

      <div className="space-y-3">
        <div className="bg-[#0e1117] p-5 rounded-xl border border-[#1c222d] flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ffd000]/10 text-[#ffd000] flex items-center justify-center border border-[#ffd000]/25">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Cliente API REST</h3>
              <p className="text-xs text-slate-400">Peticiones fluidas con <code className="text-[#ffd000] font-mono">fluent-rest-client</code></p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/25 px-2.5 py-1 rounded-md">
            Activo (/api)
          </span>
        </div>

        <div className="bg-[#0e1117] p-5 rounded-xl border border-[#1c222d] flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center border border-[#38bdf8]/25">
              <Database size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Data Grid Engine</h3>
              <p className="text-xs text-slate-400">Tablas persistentes con <code className="text-[#38bdf8] font-mono">react-apextable-pro</code></p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/25 px-2.5 py-1 rounded-md">
            React 19 Ready
          </span>
        </div>

        <div className="bg-[#0e1117] p-5 rounded-xl border border-[#1c222d] flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#10b981]/10 text-[#10b981] flex items-center justify-center border border-[#10b981]/25">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Seguridad & Soft Delete</h3>
              <p className="text-xs text-slate-400">Middleware Zod, Helmet, Rate-Limit y Plugin Mongoose SoftDelete (status: 1/0)</p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/25 px-2.5 py-1 rounded-md">
            Habilitado
          </span>
        </div>
      </div>
    </div>
  );
}
