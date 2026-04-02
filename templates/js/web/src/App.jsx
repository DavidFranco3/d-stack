import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Server, Layout, Shield, Github, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch('/api/health')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="grid-bg" />
      <div className="glow top-[-10%] left-[-10%]" />
      <div className="glow bottom-[-10%] right-[-10%]" style={{ background: 'radial-gradient(circle, hsla(var(--accent), 0.1) 0%, transparent 70%)' }} />

      <nav className="premium-container flex justify-between items-center py-6 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center p-1">
            <Rocket size={18} color="white" />
          </div>
          <span className="font-outfit font-bold text-xl tracking-tight">GravityStack</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full glass text-sm font-medium">
            <UserIcon size={14} className="text-primary" />
            <span>{user?.name}</span>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <button onClick={handleLogout} className="text-white/40 hover:text-red-400 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
          <a href="#" className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
            <Github size={18} />
          </a>
        </div>
      </nav>

      <main className="premium-container pt-20 pb-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-8 text-xs font-semibold tracking-wider uppercase text-white/60">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(var(--accent))' }} />
            Framework V1.0 is Live
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl mb-6 gradient-text">
            Build Faster with <br /> GravityStack
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/50 mb-12 leading-relaxed">
            A premium fullstack monolith template. Express.js power meets React aesthetics. 
            Crafted for developers who value performance and beauty.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary w-full sm:w-auto">
              Get Started <ChevronRight size={18} />
            </button>
            <button className="glass px-8 py-3 rounded-xl font-semibold hover:bg-white/5 transition-all text-sm w-full sm:w-auto">
              Read Documentation
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: <Server className="text-blue-400" />, title: "Express Backend", desc: "Solid API core with production-ready static serving." },
            { icon: <Layout className="text-purple-400" />, title: "React + Vite", desc: "Blazing fast dev experience with modern UI primitives." },
            { icon: <Shield className="text-green-400" />, title: "Type Safe", desc: "Built-in support for TypeScript and architectural best practices." }
          ].map((feature, i) => (
            <div key={i} className="glass p-8 group hover:border-white/20 transition-all cursor-default">
              <div className="mb-4 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl mb-2">{feature.title}</h3>
              <p className="text-white/40 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-8 glass rounded-2xl border-dashed border-white/10 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h2 className="text-2xl mb-2">Backend Connection</h2>
            <p className="text-white/40 text-sm">Testing communication with Express API...</p>
          </div>
          <div className="px-6 py-4 glass bg-black/40 rounded-xl font-mono text-xs">
            {loading ? (
              <span className="text-amber-400 animate-pulse">Requesting health check...</span>
            ) : data ? (
              <span className="text-green-400">✅ {JSON.stringify(data)}</span>
            ) : (
              <span className="text-red-400">❌ Error connecting to server</span>
            )}
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="premium-container flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 text-sm">
          <p>© 2026 GravityStack Framework. Built with ❤️</p>
          <div className="flex gap-8">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
