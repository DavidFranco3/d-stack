// D-Stack Official Landing Page Interactive JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Terminal Simulator State & Logs
  const terminalScreen = document.getElementById('terminalScreen');
  const termBtns = document.querySelectorAll('.term-btn');

  const simulatedLogs = {
    init: `
<span class="t-cyan">$ dstack init my-awesome-app</span>

   <span class="t-cyan">_____         _____ _             _     </span>
  <span class="t-cyan">|  __ \\       / ____| |           | |    </span>
  <span class="t-cyan">| |  | |_____| (___ | |_ __ _  ___| | __ </span>
  <span class="t-cyan">| |  | |______\\___ \\| __/ _\` |/ __| |/ / </span>
  <span class="t-cyan">| |__| |      ____) | || (_| | (__|   <  </span>
  <span class="t-cyan">|_____/      |_____/ \\__\\__,_|\\___|_|\\_\\ </span>

  <span class="t-gray">Full-Stack Monolith Framework by David Franco (Express + React)</span>

? Select language: <span class="t-green">TypeScript (Recommended)</span>
? Would you like to install dependencies automatically? <span class="t-green">Yes</span>

<span class="t-cyan">🚀 Initializing my-awesome-app in TypeScript...</span>
<span class="t-cyan">📦 Installing dependencies for API and Web...</span>

<span class="t-green">✅ Dependencies installed successfully!</span>
<span class="t-green">🎉 Project my-awesome-app created successfully!</span>

<span class="t-yellow">Next steps:</span>
  cd my-awesome-app
  npm run dev
    `,

    resource: `
<span class="t-cyan">$ dstack g resource Product</span>

<span class="t-cyan">⚡ Scaffolding resource "Product"...</span>

<span class="t-green">✅ Created model: api/src/models/Product.ts</span>
<span class="t-green">✅ Created service: api/src/services/productService.ts</span>
<span class="t-green">✅ Created controller: api/src/controllers/productController.ts</span>
<span class="t-green">✅ Created route: api/src/routes/productRoutes.ts</span>
<span class="t-green">✅ Created web page: web/src/pages/ProductsPage.tsx</span>

<span class="t-magenta">💡 Route registered and mounted automatically!</span>
   <span class="t-gray">app.use('/api/products', productRoutes);</span>
    `,

    doctor: `
<span class="t-cyan">$ dstack doctor</span>

   <span class="t-cyan">_____         _____ _             _     </span>
  <span class="t-cyan">|  __ \\       / ____| |           | |    </span>
  <span class="t-cyan">| |  | |_____| (___ | |_ __ _  ___| | __ </span>
  <span class="t-cyan">| |  | |______\\___ \\| __/ _\` |/ __| |/ / </span>
  <span class="t-cyan">| |__| |      ____) | || (_| | (__|   <  </span>
  <span class="t-cyan">|_____/      |_____/ \\__\\__,_|\\___|_|\\_\\ </span>

🩺 Running D-Stack System Diagnostic...

  <span class="t-green">✅ Node.js Version: v20.11.0 (>= 18.0.0)</span>
  <span class="t-green">✅ npm Version: 10.2.4 (>= 9.0.0)</span>
  <span class="t-green">✅ Workspace: D-Stack App detected</span>
  <span class="t-gray">🔍 Checking local MongoDB service (localhost:27017)...</span>
  <span class="t-green">✅ MongoDB: Service detected running on port 27017</span>

<span class="t-cyan">✨ Diagnostic completed with 0 errors!</span>
    `,

    help: `
<span class="t-cyan">$ dstack --help</span>

Usage: dstack [options] [command]

D-Stack CLI: Generate full-stack monolith applications and components

Options:
  <span class="t-yellow">-V, --version</span>                output the version number
  <span class="t-yellow">-h, --help</span>                   display help for command

Commands:
  <span class="t-green">init [options] [name]</span>        Initialize a new D-Stack project (monolith)
  <span class="t-green">generate|g &lt;type&gt; &lt;name&gt;</span>     Generate components or full CRUD resources
  <span class="t-green">doctor</span>                       Run system and workspace health diagnostics
  <span class="t-green">help [command]</span>               Display help for command
    `
  };

  // Color Styles for Terminal
  const style = document.createElement('style');
  style.innerHTML = `
    .t-cyan { color: #38bdf8; font-weight: 600; }
    .t-green { color: #34d399; font-weight: 600; }
    .t-yellow { color: #fbbf24; font-weight: 600; }
    .t-magenta { color: #f472b6; font-weight: 600; }
    .t-gray { color: #64748b; }
  `;
  document.head.appendChild(style);

  // Simulated Command Function
  window.runSimulatedCommand = (cmdKey) => {
    termBtns.forEach(btn => btn.classList.remove('active'));
    const targetBtn = Array.from(termBtns).find(b => b.getAttribute('onclick')?.includes(cmdKey));
    if (targetBtn) targetBtn.classList.add('active');

    terminalScreen.innerHTML = simulatedLogs[cmdKey] || '';
  };

  // Initialize with 'resource' command log
  runSimulatedCommand('resource');

  // Copy Install Command Button
  const copyInstallBtn = document.getElementById('copyInstallBtn');
  if (copyInstallBtn) {
    copyInstallBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('npm install -g dstack');
      const originalHTML = copyInstallBtn.innerHTML;
      copyInstallBtn.innerHTML = '<i data-lucide="check" style="color:#10b981;"></i>';
      if (window.lucide) lucide.createIcons();
      setTimeout(() => {
        copyInstallBtn.innerHTML = originalHTML;
        if (window.lucide) lucide.createIcons();
      }, 2000);
    });
  }

  // CLI Reference Hub Tab Switcher
  const cliHubPane = document.getElementById('cliHubPane');
  const cliHubTabs = document.querySelectorAll('.cli-hub-tab');

  const cliHubContent = {
    init: `
      <div class="cmd-header">
        <div class="cmd-tag">Inicialización Monolítica</div>
        <h3 class="cmd-title"><code>dstack init [nombre-proyecto]</code></h3>
      </div>
      <p class="cmd-desc">
        Crea la estructura de carpetas de un nuevo proyecto monolítico D-Stack con Express + MongoDB Mongoose en el backend y Vite + React 19 + Tailwind CSS en el frontend.
      </p>

      <div class="cmd-details">
        <div class="cmd-subtitle">Argumentos & Opciones:</div>
        <ul class="cmd-list">
          <li><code>[nombre-proyecto]</code> (Opcional): Nombre del directorio y del paquete en <code>package.json</code>. Si se omite, la CLI lo solicitará interactivamente.</li>
          <li><code>-t, --template &lt;ts|js&gt;</code>: Especifica el lenguaje (TypeScript o JavaScript) sin desplegar menús.</li>
        </ul>

        <div class="cmd-subtitle">Ejemplo de Uso:</div>
        <div class="code-block">
          <code># Modo interactivo<br>dstack init mi-tienda-online<br><br># Modo directo con TypeScript<br>dstack init mi-tienda-online -t ts</code>
        </div>

        <div class="cmd-subtitle">Estructura Generada:</div>
        <div class="cmd-tree">mi-tienda-online/
├── api/                   # Backend Express + Node.js
│   ├── src/config/        # Conexión MongoDB y Seeder
│   ├── src/controllers/   # Controladores HTTP
│   ├── src/middleware/    # Helmet, RateLimit, Zod, Logger
│   ├── src/models/        # Modelos Mongoose (User, Resource)
│   └── src/routes/        # Rutas REST Auth y Resources
├── web/                   # Frontend Vite + React 19
│   ├── src/api/           # Cliente fluent-rest-client
│   ├── src/components/    # ApexTable, AppLayout, Navbar
│   └── src/pages/         # Dashboard, ResourcesPage, Users
└── shared/                # Tipos e Interfaces compartidas TS</div>
      </div>
    `,

    resource: `
      <div class="cmd-header">
        <div class="cmd-tag tag-pro">Scaffolding CRUD</div>
        <h3 class="cmd-title"><code>dstack g resource &lt;Nombre&gt;</code></h3>
      </div>
      <p class="cmd-desc">
        Genera un recurso CRUD completo en menos de 1 segundo. Crea el modelo Mongoose, servicio, controlador Express, rutas con validación Zod y la página Web en React con ApexTable Pro.
      </p>

      <div class="cmd-details">
        <div class="cmd-subtitle">Alias y Comandos Equivalentes:</div>
        <ul class="cmd-list">
          <li><code>dstack generate resource &lt;Nombre&gt;</code></li>
          <li><code>dstack g resource &lt;Nombre&gt;</code></li>
        </ul>

        <div class="cmd-subtitle">Ejemplo de Uso:</div>
        <div class="code-block">
          <code># Generar recurso 'Product'<br>dstack g resource Product<br><br># Generar recurso 'Invoice'<br>dstack g resource Invoice</code>
        </div>

        <div class="cmd-subtitle">Módulos Creados en un solo paso:</div>
        <div class="cmd-tree">1. Backend Model:     api/src/models/Product.ts
2. Backend Service:   api/src/services/productService.ts
3. Backend Controller: api/src/controllers/productController.ts
4. Backend Routes:    api/src/routes/productRoutes.ts
5. Frontend Page:      web/src/pages/ProductsPage.tsx</div>
      </div>
    `,

    doctor: `
      <div class="cmd-header">
        <div class="cmd-tag">Diagnóstico de Entorno</div>
        <h3 class="cmd-title"><code>dstack doctor</code></h3>
      </div>
      <p class="cmd-desc">
        Ejecuta un diagnóstico del entorno de trabajo comprobando la versión de Node.js, npm, conectividad con la base de datos MongoDB local (puerto 27017) y la estructura del proyecto.
      </p>

      <div class="cmd-details">
        <div class="cmd-subtitle">Ejemplo de Uso:</div>
        <div class="code-block">
          <code>dstack doctor</code>
        </div>

        <div class="cmd-subtitle">Salida del Diagnóstico:</div>
        <div class="cmd-tree">[✔] Node.js Version: v20.11.0 (>= 18.0.0)
[✔] npm Version: 10.2.4 (>= 9.0.0)
[✔] MongoDB Connection: OK (mongodb://127.0.0.1:27017)
[✔] Monolith Structure: Valid (api, web, shared directories found)</div>
      </div>
    `,

    help: `
      <div class="cmd-header">
        <div class="cmd-tag">Utilidades & Ayuda</div>
        <h3 class="cmd-title"><code>dstack --version | --help</code></h3>
      </div>
      <p class="cmd-desc">
        Comandos de información general para consultar la versión instalada del CLI o desplegar el menú de ayuda interactivo.
      </p>

      <div class="cmd-details">
        <div class="cmd-subtitle">Ejemplos de Uso:</div>
        <div class="code-block">
          <code>dstack --version   # Muestra la versión actual (ej. 1.0.0)<br>dstack --help      # Muestra todas las opciones disponibles</code>
        </div>
      </div>
    `
  };

  const setCliHubTab = (cmdKey) => {
    cliHubTabs.forEach(tab => tab.classList.remove('active'));
    const activeTab = Array.from(cliHubTabs).find(t => t.getAttribute('data-cmd') === cmdKey);
    if (activeTab) activeTab.classList.add('active');

    if (cliHubPane) {
      cliHubPane.innerHTML = cliHubContent[cmdKey] || '';
      if (window.lucide) lucide.createIcons();
    }
  };

  cliHubTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cmdKey = tab.getAttribute('data-cmd');
      if (cmdKey) setCliHubTab(cmdKey);
    });
  });

  // Initialize with 'init' tab
  setCliHubTab('init');

  // Architecture Nodes Hover Effect
  const archNodes = document.querySelectorAll('.arch-node');
  const archInfoTitle = document.getElementById('archInfoTitle');
  const archInfoDesc = document.getElementById('archInfoDesc');

  const archDetails = {
    'info-client': {
      title: 'React Client (Frontend SPA)',
      desc: 'Capa visual construida con React 19 + Vite 8 + Tailwind CSS. Realiza solicitudes HTTP asíncronas con fluent-rest-client.'
    },
    'info-routes': {
      title: 'Express Routes Layer',
      desc: 'Mapea las URLs de los endpoints a sus correspondientes métodos de controlador. Integra los esquemas de validación Zod.'
    },
    'info-zod': {
      title: 'Middleware de Validación Zod',
      desc: 'Intercepta las peticiones y verifica que el body, params y query cumplan estrictamente con las reglas del esquema antes de pasar al controlador.'
    },
    'info-controller': {
      title: 'Controller Layer (HTTP Handler)',
      desc: 'Procesa req y res. No contiene lógica directa de base de datos; invoca los métodos estáticos del Service y responde con JSON.'
    },
    'info-service': {
      title: 'Service & Model Layer (DB Logic)',
      desc: 'Contiene la lógica pura de negocio y las consultas Mongoose a la base de datos MongoDB. Desacoplado totalmente de Express req/res.'
    }
  };

  archNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      archNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      const target = node.getAttribute('data-target');
      if (target && archDetails[target]) {
        archInfoTitle.textContent = archDetails[target].title;
        archInfoDesc.textContent = archDetails[target].desc;
      }
    });
  });
});
