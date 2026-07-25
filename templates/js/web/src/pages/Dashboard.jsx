import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Server, Layout, Shield, Github, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.resource('health').safe().get()
      .then((res) => {
        if (res.ok && res.data) {
          setData(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0c10]">
      <div className="grid-bg" />
      <div className="glow top-[-10%] left-[-10%]" />
      <div className="glow bottom-[-10%] right-[-10%]" />

      {/* Navbar */}
      <nav className="premium-container flex justify-between items-center py-6 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center p-1.5 shadow-lg shadow-indigo-500/30">
            <Rocket size={20} color="white" />
          </div>
          <span className="font-outfit font-bold text-xl tracking-tight text-white">D-Stack</span>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full glass text-sm font-medium border border-white/10">
            <UserIcon size={16} className="text-indigo-400" />
            <span className="text-white/90">{user?.name || 'David Admin'}</span>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <button 
              onClick={handleLogoutClick} 
              className="text-white/40 hover:text-red-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Cerrar Sesión"
            >
              <span>Salir</span>
              <LogOut size={14} />
            </button>
          </div>
          <a href="https://github.com/DavidFranco3/d-stack" target="_blank" rel="noopener" className="p-2.5 glass rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <Github size={18} />
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="premium-container pt-16 pb-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass mb-8 text-xs font-semibold tracking-wider uppercase text-indigo-300 border border-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Framework V1.0 is Live & Ready
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl mb-6 font-outfit font-extrabold tracking-tight gradient-text">
            Build Faster with <br /> D-Stack Monolith
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/50 mb-10 leading-relaxed max-w-2xl mx-auto">
            A premium fullstack monolith template. 
            Express.js power meets React aesthetics with <strong className="text-indigo-400 font-normal">fluent-rest-client</strong>.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://github.com/DavidFranco3/d-stack" target="_blank" rel="noopener" className="btn-primary w-full sm:w-auto text-sm">
              Get Started <ChevronRight size={18} />
            </a>
            <a href="#features" className="glass px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all text-sm w-full sm:w-auto text-white/80 border border-white/10">
              Read Documentation
            </a>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          id="features"
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: <Server className="text-indigo-400" />, title: "Express Backend", desc: "Solid API core with production-ready static serving and layered architecture." },
            { icon: <Layout className="text-purple-400" />, title: "React + Fluent REST", desc: "Preconfigured fluent-rest-client for clean, type-safe API requests." },
            { icon: <Shield className="text-emerald-400" />, title: "Security & Zod", desc: "Helmet protection, rate-limiting, and automatic request schema validation." }
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1">
              <div className="mb-5 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Backend Health Check Tester Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-8 glass rounded-2xl border border-dashed border-white/15 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Backend Connection Status</h2>
            <p className="text-white/40 text-sm">Testing communication with Express API via <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">fluent-rest-client</code>...</p>
          </div>
          <div className="px-6 py-4 glass bg-black/60 rounded-xl font-mono text-xs border border-white/10">
            {loading ? (
              <span className="text-amber-400 animate-pulse">Requesting health check...</span>
            ) : data ? (
              <span className="text-emerald-400 font-semibold">✅ {JSON.stringify(data)}</span>
            ) : (
              <span className="text-red-400">❌ Error connecting to server</span>
            )}
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-white/5 py-10">
        <div className="premium-container flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
          <p>© 2026 D-Stack Monolith Framework by David Franco. Built with ❤️</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
