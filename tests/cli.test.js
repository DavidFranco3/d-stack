import { test, describe } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cliPath = path.resolve(__dirname, '../cli/index.js');

describe('⚡ D-Stack CLI Tests', () => {
  test('CLI --version returns version number 1.2.0', () => {
    const output = execSync(`node "${cliPath}" --version`, { encoding: 'utf-8' });
    assert.strictEqual(output.trim(), '1.2.0');
  });

  test('CLI --help lists available commands', () => {
    const output = execSync(`node "${cliPath}" --help`, { encoding: 'utf-8' });
    assert.match(output, /init/);
    assert.match(output, /generate/);
    assert.match(output, /doctor/);
  });

  test('CLI doctor runs system diagnostics', () => {
    const output = execSync(`node "${cliPath}" doctor`, { encoding: 'utf-8' });
    assert.match(output, /Running D-Stack System Diagnostic/);
    assert.match(output, /Node.js Version/);
  });

  test('dstack generate resource scaffolds files and auto-injects routes', () => {
    const tempDir = path.join(__dirname, 'temp-app');
    fs.removeSync(tempDir);
    fs.ensureDirSync(path.join(tempDir, 'api', 'src', 'routes'));
    fs.ensureDirSync(path.join(tempDir, 'web', 'src', 'pages'));

    // Mock server.ts & App.tsx
    const serverTsPath = path.join(tempDir, 'api', 'src', 'server.ts');
    const appTsxPath = path.join(tempDir, 'web', 'src', 'App.tsx');
    fs.writeFileSync(path.join(tempDir, 'api', 'tsconfig.json'), '{}');
    fs.writeFileSync(serverTsPath, `import express from 'express';\nimport resourceRoutes from './routes/resourceRoutes.js';\nconst app = express();\napp.use('/api/resources', resourceRoutes);\napp.listen(4000);`);
    fs.writeFileSync(appTsxPath, `import SettingsPage from './pages/SettingsPage';\nexport default function App() { return <Routes><Route path="/settings" element={<SettingsPage />} /></Routes>; }`);

    const output = execSync(`node "${cliPath}" g resource Order`, {
      cwd: tempDir,
      encoding: 'utf-8',
    });

    assert.match(output, /Created model/);
    assert.match(output, /Created service/);
    assert.match(output, /Created controller/);
    assert.match(output, /Created route/);
    assert.match(output, /Created page/);

    assert.ok(fs.existsSync(path.join(tempDir, 'api', 'src', 'models', 'Order.ts')));
    assert.ok(fs.existsSync(path.join(tempDir, 'api', 'src', 'services', 'orderService.ts')));
    assert.ok(fs.existsSync(path.join(tempDir, 'api', 'src', 'controllers', 'orderController.ts')));
    assert.ok(fs.existsSync(path.join(tempDir, 'api', 'src', 'routes', 'orderRoutes.ts')));
    assert.ok(fs.existsSync(path.join(tempDir, 'web', 'src', 'pages', 'OrderPage.tsx')));

    // Check auto-injections
    const updatedServer = fs.readFileSync(serverTsPath, 'utf-8');
    assert.match(updatedServer, /orderRoutes/);
    assert.match(updatedServer, /app\.use\('\/api\/orders'/);

    const updatedApp = fs.readFileSync(appTsxPath, 'utf-8');
    assert.match(updatedApp, /OrderPage/);
    assert.match(updatedApp, /Route path="\/orders"/);

    // Generated page must import everything it uses (Dropdown, lucide icons, React)
    const pageContent = fs.readFileSync(path.join(tempDir, 'web', 'src', 'pages', 'OrderPage.tsx'), 'utf-8');
    assert.match(pageContent, /import React, \{ useState, useEffect \} from 'react';/);
    assert.match(pageContent, /import \{ Edit2, Trash2 \} from 'lucide-react';/);
    assert.match(pageContent, /import \{ Dropdown \} from '..\/components\/Dropdown';/);

    // Generated routes must require auth and validate PUT requests
    const routeContent = fs.readFileSync(path.join(tempDir, 'api', 'src', 'routes', 'orderRoutes.ts'), 'utf-8');
    assert.match(routeContent, /authMiddleware/);
    assert.match(routeContent, /updateOrderSchema/);
    assert.match(routeContent, /router\.use\(authMiddleware\)/);
    assert.match(routeContent, /validate\(updateOrderSchema\), OrderController\.update/);

    // Generated controllers must coerce req.params.id to string (Express 5 types)
    const controllerContent = fs.readFileSync(path.join(tempDir, 'api', 'src', 'controllers', 'orderController.ts'), 'utf-8');
    assert.match(controllerContent, /const id = String\(req\.params\.id\);/);

    fs.removeSync(tempDir);
  });

  test('dstack generate auth scaffolds Auth module', () => {
    const tempDir = path.join(__dirname, 'temp-auth-app');
    fs.removeSync(tempDir);
    fs.ensureDirSync(path.join(tempDir, 'api', 'src'));
    fs.ensureDirSync(path.join(tempDir, 'web', 'src', 'pages'));

    const appTsxPath = path.join(tempDir, 'web', 'src', 'App.tsx');
    fs.writeFileSync(path.join(tempDir, 'api', 'tsconfig.json'), '{}');
    fs.writeFileSync(appTsxPath, `import Login from './pages/Login';\nexport default function App() { return <Route \n          path="/login" element={<Login />} />; }`);

    const output = execSync(`node "${cliPath}" g auth`, {
      cwd: tempDir,
      encoding: 'utf-8',
    });

    assert.match(output, /Scaffolding Auth Module/);
    assert.ok(fs.existsSync(path.join(tempDir, 'web', 'src', 'pages', 'RegisterPage.tsx')));

    const updatedApp = fs.readFileSync(appTsxPath, 'utf-8');
    assert.match(updatedApp, /RegisterPage/);
    assert.match(updatedApp, /Route path="\/register"/);

    // g auth must also scaffold the backend /api/auth endpoints
    const authRoutes = fs.readFileSync(path.join(tempDir, 'api', 'src', 'routes', 'authRoutes.ts'), 'utf-8');
    assert.match(authRoutes, /'\/register'/);
    assert.match(authRoutes, /'\/me'/);
    assert.match(authRoutes, /'\/logout'/);
    assert.ok(fs.existsSync(path.join(tempDir, 'api', 'src', 'controllers', 'authController.ts')));
    assert.ok(fs.existsSync(path.join(tempDir, 'api', 'src', 'services', 'authService.ts')));

    // Generated RegisterPage must not store the token in localStorage
    const regPage = fs.readFileSync(path.join(tempDir, 'web', 'src', 'pages', 'RegisterPage.tsx'), 'utf-8');
    assert.doesNotMatch(regPage, /localStorage/);

    fs.removeSync(tempDir);
  });

  test('dstack remove resource deletes scaffolded resource files', () => {
    const tempDir = path.join(__dirname, 'temp-rm-app');
    fs.removeSync(tempDir);
    fs.ensureDirSync(path.join(tempDir, 'api', 'src', 'routes'));
    fs.ensureDirSync(path.join(tempDir, 'web', 'src', 'pages'));
    fs.writeFileSync(path.join(tempDir, 'api', 'tsconfig.json'), '{}');

    // Create resource
    execSync(`node "${cliPath}" g resource Product`, { cwd: tempDir, encoding: 'utf-8' });
    assert.ok(fs.existsSync(path.join(tempDir, 'api', 'src', 'models', 'Product.ts')));

    // Remove resource
    const rmOutput = execSync(`node "${cliPath}" remove resource Product`, { cwd: tempDir, encoding: 'utf-8' });
    assert.match(rmOutput, /Resource "Product" removed successfully/);
    assert.ok(!fs.existsSync(path.join(tempDir, 'api', 'src', 'models', 'Product.ts')));

    fs.removeSync(tempDir);
  });

  test('dstack remove auth removes RegisterPage and un-registers /register route', () => {
    const tempDir = path.join(__dirname, 'temp-rm-auth-app');
    fs.removeSync(tempDir);
    fs.ensureDirSync(path.join(tempDir, 'api', 'src'));
    fs.ensureDirSync(path.join(tempDir, 'web', 'src', 'pages'));

    const appTsxPath = path.join(tempDir, 'web', 'src', 'App.tsx');
    fs.writeFileSync(path.join(tempDir, 'api', 'tsconfig.json'), '{}');
    fs.writeFileSync(appTsxPath, `import Login from './pages/Login';\nexport default function App() { return <Route \n          path="/login" element={<Login />} />; }`);

    // Scaffold auth first
    execSync(`node "${cliPath}" g auth`, { cwd: tempDir, encoding: 'utf-8' });
    assert.ok(fs.existsSync(path.join(tempDir, 'web', 'src', 'pages', 'RegisterPage.tsx')));

    // Remove auth module
    const rmOutput = execSync(`node "${cliPath}" remove auth`, { cwd: tempDir, encoding: 'utf-8' });
    assert.match(rmOutput, /Auth module removed successfully/);
    assert.ok(!fs.existsSync(path.join(tempDir, 'web', 'src', 'pages', 'RegisterPage.tsx')));

    const appContent = fs.readFileSync(appTsxPath, 'utf-8');
    assert.doesNotMatch(appContent, /RegisterPage/);
    assert.doesNotMatch(appContent, /\/register/);

    fs.removeSync(tempDir);
  });

  test('dstack init scaffolds a project without node_modules and in non-interactive mode', () => {
    const tempDir = path.join(__dirname, 'temp-init-app');
    fs.removeSync(tempDir);
    fs.ensureDirSync(tempDir);

    const output = execSync(`node "${cliPath}" init my-init-app -t ts`, {
      cwd: tempDir,
      encoding: 'utf-8',
      timeout: 60000,
    });

    assert.match(output, /created successfully/);

    const projDir = path.join(tempDir, 'my-init-app');
    assert.ok(fs.existsSync(path.join(projDir, 'package.json')));
    assert.ok(fs.existsSync(path.join(projDir, 'api', 'src', 'routes', 'authRoutes.ts')));
    assert.ok(fs.existsSync(path.join(projDir, 'web', 'src', 'App.tsx')));

    // node_modules / dist / .env must NOT be copied from the templates
    assert.ok(!fs.existsSync(path.join(projDir, 'api', 'node_modules')));
    assert.ok(!fs.existsSync(path.join(projDir, 'web', 'node_modules')));
    assert.ok(!fs.existsSync(path.join(projDir, 'web', 'dist')));
    assert.ok(!fs.existsSync(path.join(projDir, '.env.example')));

    // Non-interactive mode must not have installed dependencies
    assert.ok(!fs.existsSync(path.join(projDir, 'node_modules')));

    // Project name must be applied to package.json
    const pkg = fs.readJsonSync(path.join(projDir, 'package.json'));
    assert.strictEqual(pkg.name, 'my-init-app');

    fs.removeSync(tempDir);
  });
});
