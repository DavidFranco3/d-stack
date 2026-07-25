import React from 'react';
import { Settings, ShieldCheck, Globe, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="glass p-6 rounded-2xl border border-white/5">
        <h2 className="font-outfit font-bold text-xl text-white flex items-center gap-2">
          <Settings size={22} className="text-indigo-400" />
          Configuración de la Aplicación
        </h2>
        <p className="text-xs text-slate-400 mt-1">Parámetros del sistema D-Stack y cliente API</p>
      </div>

      <div className="space-y-4">
        <div className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Cliente API REST</h3>
              <p className="text-xs text-slate-400">Peticiones fluidas con <code className="text-indigo-300">fluent-rest-client</code></p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
            Activo (/api)
          </span>
        </div>

        <div className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Data Grid Engine</h3>
              <p className="text-xs text-slate-400">Tablas persistentes con <code className="text-purple-300">react-apextable-pro</code></p>
            </div>
          </div>
          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
            v1.0.2 Activo
          </span>
        </div>

        <div className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Seguridad & Soft Delete</h3>
              <p className="text-xs text-slate-400">Middleware Zod, Helmet, Rate-Limit y Plugin Mongoose SoftDelete (status: 1/0)</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
            Habilitado
          </span>
        </div>
      </div>
    </div>
  );
}
