document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  // Terminal Simulator
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

  <span class="t-gray">D-Stack CLI - Express + React Monolith Framework</span>

? Select language: <span class="t-green">TypeScript</span>
? Would you like to install dependencies automatically? <span class="t-green">Yes</span>

<span class="t-cyan">Initializing my-awesome-app in TypeScript...</span>
<span class="t-cyan">Installing dependencies for API and Web...</span>

<span class="t-green">Dependencies installed successfully!</span>
<span class="t-green">Project my-awesome-app created successfully!</span>

<span class="t-yellow">Next steps:</span>
  cd my-awesome-app
  npm run dev
    `,

    resource: `
<span class="t-cyan">$ dstack g resource Product</span>

<span class="t-cyan">Scaffolding resource "Product"...</span>

<span class="t-green">Created model: api/src/models/Product.ts</span>
<span class="t-green">Created service: api/src/services/productService.ts</span>
<span class="t-green">Created controller: api/src/controllers/productController.ts</span>
<span class="t-green">Created route: api/src/routes/productRoutes.ts</span>
<span class="t-green">Created page: web/src/pages/ProductPage.tsx</span>

<span class="t-green">✅ Auto-registered route in server.ts: app.use('/api/products', productRoutes)</span>
<span class="t-green">✅ Auto-registered page in App.tsx: &lt;Route path="/products" element={&lt;ProductPage /&gt;} /&gt;</span>
    `,

    auth: `
<span class="t-cyan">$ dstack g auth</span>

<span class="t-cyan">Scaffolding Auth Module...</span>

<span class="t-green">Created page: web/src/pages/RegisterPage.tsx</span>
<span class="t-green">✅ Auto-registered /register route in App.tsx</span>

<span class="t-green">🎉 Auth Module successfully scaffolded!</span>
    `,

    remove: `
<span class="t-cyan">$ dstack remove resource Product</span>

<span class="t-magenta">🗑️ Removed: api/src/models/Product.ts</span>
<span class="t-magenta">🗑️ Removed: api/src/services/productService.ts</span>
<span class="t-magenta">🗑️ Removed: api/src/controllers/productController.ts</span>
<span class="t-magenta">🗑️ Removed: api/src/routes/productRoutes.ts</span>
<span class="t-magenta">🗑️ Removed: web/src/pages/ProductPage.tsx</span>

<span class="t-green">✅ Resource "Product" removed successfully!</span>
    `,

    doctor: `
<span class="t-cyan">$ dstack doctor</span>

   <span class="t-cyan">_____         _____ _             _     </span>
  <span class="t-cyan">|  __ \\       / ____| |           | |    </span>
  <span class="t-cyan">| |  | |_____| (___ | |_ __ _  ___| | __ </span>
  <span class="t-cyan">| |  | |______\\___ \\| __/ _\` |/ __| |/ / </span>
  <span class="t-cyan">| |__| |      ____) | || (_| | (__|   <  </span>
  <span class="t-cyan">|_____/      |_____/ \\__\\__,_|\\___|_|\\_\\ </span>

D-Stack System Diagnostic...

  <span class="t-green">Node.js Version: v24.19.0 (>= 18.0.0)</span>
  <span class="t-green">npm Version: 10.2.4 (>= 9.0.0)</span>
  <span class="t-green">Workspace: D-Stack App detected</span>
  <span class="t-gray">Checking local MongoDB service (localhost:27017)...</span>
  <span class="t-green">MongoDB: Service detected running on port 27017</span>

<span class="t-cyan">Diagnostic completed with 0 errors!</span>
    `
  };

  const style = document.createElement('style');
  style.innerHTML = `
    .t-cyan { color: #38bdf8; font-weight: 600; }
    .t-green { color: #10b981; font-weight: 600; }
    .t-yellow { color: #ffd000; font-weight: 600; }
    .t-magenta { color: #f43f5e; font-weight: 600; }
    .t-gray { color: #64748b; }
  `;
  document.head.appendChild(style);

  window.runSimulatedCommand = (cmdKey) => {
    termBtns.forEach(btn => btn.classList.remove('active'));
    const targetBtn = Array.from(termBtns).find(b => b.getAttribute('onclick')?.includes(cmdKey));
    if (targetBtn) targetBtn.classList.add('active');
    terminalScreen.innerHTML = simulatedLogs[cmdKey] || '';
  };

  runSimulatedCommand('resource');

  // Copy Install Command Button
  const copyInstallBtn = document.getElementById('copyInstallBtn');
  if (copyInstallBtn) {
    copyInstallBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('npm install -g @davidfranco3/dstack');
      const originalHTML = copyInstallBtn.innerHTML;
      copyInstallBtn.innerHTML = '<i data-lucide="check" style="color:#10b981;"></i>';
      if (window.lucide) lucide.createIcons();
      setTimeout(() => {
        copyInstallBtn.innerHTML = originalHTML;
        if (window.lucide) lucide.createIcons();
      }, 2000);
    });
  }

  // CLI Reference Hub
  const cliHubPane = document.getElementById('cliHubPane');
  const cliHubTabs = document.querySelectorAll('.cli-hub-tab');

  const cliHubContent = {
    init: `
      <div class="cmd-header">
        <div class="cmd-tag">Project Initialization</div>
        <h3 class="cmd-title"><code>dstack init [project-name]</code></h3>
      </div>
      <p class="cmd-desc">
        Creates a new D-Stack project with Express + Mongoose backend and Vite + React 19 + Tailwind CSS frontend.
      </p>

      <div class="cmd-details">
        <div class="cmd-subtitle">Arguments & Options:</div>
        <ul class="cmd-list">
          <li><code>[project-name]</code> (optional): Directory and package name. Prompts if omitted.</li>
          <li><code>-t, --template &lt;ts|js&gt;</code>: Language selection for non-interactive mode.</li>
          <li><code>-i, --install</code>: Install dependencies automatically (non-interactive mode).</li>
        </ul>

        <div class="cmd-subtitle">Examples:</div>
        <div class="code-block">
          <code># Interactive<br>dstack init my-app<br><br># Non-interactive TypeScript + auto-install<br>dstack init my-app -t ts -i</code>
        </div>

        <div class="cmd-subtitle">Generated Structure:</div>
        <div class="cmd-tree">my-app/
├── api/                   # Express backend
│   ├── src/config/        # MongoDB connection & seeder
│   ├── src/controllers/   # HTTP handlers
│   ├── src/middleware/     # Helmet, rate-limit, Zod, logger
│   ├── src/models/        # Mongoose schemas
│   └── src/routes/        # REST routes
├── web/                   # React SPA
│   ├── src/api/           # HTTP client
│   ├── src/components/    # Shared components
│   └── src/pages/         # Route pages
└── shared/                # Shared TypeScript types</div>
      </div>
    `,

    resource: `
      <div class="cmd-header">
        <div class="cmd-tag tag-pro">CRUD Scaffolding</div>
        <h3 class="cmd-title"><code>dstack g resource &lt;Name&gt;</code></h3>
      </div>
      <p class="cmd-desc">
        Generates a complete CRUD module: Mongoose model, service, controller, routes with Zod validation, and a React page with ApexTable.
      </p>

      <div class="cmd-details">
        <div class="cmd-subtitle">Aliases:</div>
        <ul class="cmd-list">
          <li><code>dstack generate resource &lt;Name&gt;</code></li>
          <li><code>dstack g resource &lt;Name&gt;</code></li>
        </ul>

        <div class="cmd-subtitle">Examples:</div>
        <div class="code-block">
          <code>dstack g resource Product<br>dstack g resource Invoice</code>
        </div>

        <div class="cmd-subtitle">Files Created & Auto-Injected:</div>
        <div class="cmd-tree">1. Model:      api/src/models/Product.ts
2. Service:    api/src/services/productService.ts
3. Controller: api/src/controllers/productController.ts
4. Routes:     api/src/routes/productRoutes.ts (Auto-injected into server.ts)
5. Page:       web/src/pages/ProductPage.tsx (Auto-injected into App.tsx)</div>
      </div>
    `,

    auth: `
      <div class="cmd-header">
        <div class="cmd-tag tag-pro">Authentication</div>
        <h3 class="cmd-title"><code>dstack g auth</code></h3>
      </div>
      <p class="cmd-desc">
        Scaffolds a complete Authentication & Account Registration flow with backend endpoints and React UI.
      </p>

      <div class="cmd-details">
        <div class="cmd-subtitle">Examples:</div>
        <div class="code-block">
          <code>dstack generate auth<br>dstack g auth</code>
        </div>

        <div class="cmd-subtitle">Files Created & Auto-Injected:</div>
        <div class="cmd-tree">1. Page:   web/src/pages/RegisterPage.tsx
2. Route:  Auto-registered /register in App.tsx
3. Endpoints: /api/auth/register, /login, /me & /logout (httpOnly cookie sessions)</div>
      </div>
    `,

    remove: `
      <div class="cmd-header">
        <div class="cmd-tag">Cleanup Utility</div>
        <h3 class="cmd-title"><code>dstack remove &lt;resource|auth&gt; [Name]</code></h3>
      </div>
      <p class="cmd-desc">
        Safely deletes generated files and automatically un-injects imports and routes from server.ts and App.tsx. Supports both resources and the auth module.
      </p>

      <div class="cmd-details">
        <div class="cmd-subtitle">Commands & Aliases:</div>
        <ul class="cmd-list">
          <li><code>dstack remove resource &lt;Name&gt;</code> (alias: <code>dstack rm resource &lt;Name&gt;</code>)</li>
          <li><code>dstack remove auth</code> (alias: <code>dstack rm auth</code>)</li>
        </ul>

        <div class="cmd-subtitle">Examples:</div>
        <div class="code-block">
          <code>dstack rm resource Product<br>dstack rm auth</code>
        </div>
      </div>
    `,

    doctor: `
      <div class="cmd-header">
        <div class="cmd-tag">System Diagnostics</div>
        <h3 class="cmd-title"><code>dstack doctor</code></h3>
      </div>
      <p class="cmd-desc">
        Checks Node.js version, npm version, MongoDB connectivity (port 27017), and project structure validity.
      </p>

      <div class="cmd-details">
        <div class="cmd-subtitle">Example:</div>
        <div class="code-block">
          <code>dstack doctor</code>
        </div>

        <div class="cmd-subtitle">Sample Output:</div>
        <div class="cmd-tree">[OK] Node.js Version: v24.19.0 (>= 18.0.0)
[OK] npm Version: 10.2.4 (>= 9.0.0)
[OK] MongoDB Connection: OK (mongodb://127.0.0.1:27017)
[OK] Monolith Structure: Valid (api, web, shared)</div>
      </div>
    `,

    help: `
      <div class="cmd-header">
        <div class="cmd-tag">Utility Commands</div>
        <h3 class="cmd-title"><code>dstack --version | --help</code></h3>
      </div>
      <p class="cmd-desc">
        Display version information or the full help menu with all available commands and options.
      </p>

      <div class="cmd-details">
        <div class="cmd-subtitle">Examples:</div>
        <div class="code-block">
          <code>dstack --version   # Shows version (e.g. 1.0.0)<br>dstack --help      # Shows all commands and options</code>
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

  setCliHubTab('init');
});
