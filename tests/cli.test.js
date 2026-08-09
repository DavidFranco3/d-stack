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
  test('CLI --version returns version number 1.1.0', () => {
    const output = execSync(`node "${cliPath}" --version`, { encoding: 'utf-8' });
    assert.strictEqual(output.trim(), '1.1.0');
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
});
