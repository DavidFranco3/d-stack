#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import shell from 'shelljs';
import net from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

// ASCII Banner
const showBanner = () => {
  console.log(chalk.cyan(`
   _____         _____ _             _     
  |  __ \\       / ____| |           | |    
  | |  | |_____| (___ | |_ __ _  ___| | __ 
  | |  | |______\\___ \\| __/ _\` |/ __| |/ / 
  | |__| |      ____) | || (_| | (__|   <  
  |_____/      |_____/ \\__\\__,_|\\___|_|\\_\\ 
  `));
  console.log(chalk.gray(`  Full-Stack Monolith Framework by David Franco (Express + React)\n`));
};

program
  .name('dstack')
  .description('D-Stack CLI: Generate full-stack monolith applications and components')
  .version('1.2.1');

// Initialize Command
program
  .command('init')
  .description('Initialize a new D-Stack project')
  .argument('[name]', 'Project name')
  .option('-t, --template <type>', 'Language template: ts (TypeScript) or js (JavaScript)')
  .option('-i, --install', 'Install dependencies automatically (non-interactive mode)')
  .action(async (name, options) => {
    showBanner();

    let language = null;
    if (options.template) {
      const normalized = options.template.toLowerCase();
      if (normalized === 'ts' || normalized === 'typescript') {
        language = 'TypeScript';
      } else if (normalized === 'js' || normalized === 'javascript') {
        language = 'JavaScript';
      } else {
        console.error(chalk.red(`❌ Invalid template "${options.template}". Use "ts" for TypeScript or "js" for JavaScript.`));
        process.exit(1);
      }
    }

    const questions = [];

    if (!name) {
      questions.push({
        type: 'input',
        name: 'projectName',
        message: 'What is your project named?',
        default: 'my-dstack-app',
        validate: (input) => input.trim() !== '' || 'Project name cannot be empty',
      });
    }

    if (!language) {
      questions.push({
        type: 'list',
        name: 'language',
        message: 'Select language:',
        choices: [
          { name: 'TypeScript (Recommended)', value: 'TypeScript' },
          { name: 'JavaScript', value: 'JavaScript' },
        ],
      });
    }

    const nonInteractive = Boolean(name) && Boolean(language);

    if (!nonInteractive) {
      questions.push({
        type: 'confirm',
        name: 'installDeps',
        message: 'Would you like to install dependencies automatically?',
        default: true,
      });
    }

    const answers = questions.length > 0 ? await inquirer.prompt(questions) : {};
    const projectName = name || answers.projectName;
    const effectiveLanguage = language || answers.language;
    const isTS = effectiveLanguage === 'TypeScript';
    const languageFolder = isTS ? 'ts' : 'js';
    const installDeps = nonInteractive ? Boolean(options.install) : Boolean(answers.installDeps);

    const targetPath = path.join(process.cwd(), projectName);
    const templatePath = path.join(__dirname, '../templates', languageFolder);

    console.log(chalk.cyan(`\n🚀 Initializing ${chalk.bold(projectName)} in ${chalk.yellow(effectiveLanguage)}...\n`));

    try {
      if (fs.existsSync(targetPath)) {
        console.error(chalk.red(`❌ Error: Directory "${projectName}" already exists.`));
        process.exit(1);
      }

      // Copy template (excluding heavy/generated folders like node_modules and dist)
      await fs.copy(templatePath, targetPath, {
        filter: (src) => {
          const rel = path.relative(templatePath, src);
          const parts = rel.split(path.sep);
          return !parts.includes('node_modules')
            && !parts.includes('dist')
            && !parts.includes('dist-ssr')
            && !parts.includes('.git')
            && !parts.some((p) => p === '.env' || p.startsWith('.env.'));
        },
      });

      // Update project name in root package.json
      const packageJsonPath = path.join(targetPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkg = await fs.readJson(packageJsonPath);
        pkg.name = projectName;
        await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
      }

      // Install dependencies if requested
      if (installDeps) {
        console.log(chalk.cyan(`📦 Installing dependencies for Root, API, and Web... (this may take a minute)\n`));
        shell.cd(targetPath);

        const resRoot = shell.exec('npm install');
        const resApi = shell.exec('npm --prefix api install');
        const resWeb = shell.exec('npm --prefix web install');

        if (resRoot.code !== 0 || resApi.code !== 0 || resWeb.code !== 0) {
          console.error(chalk.red('\n⚠️ Error installing some dependencies. You can run "npm run install-all" manually later.'));
        } else {
          console.log(chalk.green('\n✅ Dependencies installed successfully!'));
        }
      }

      console.log(chalk.green(`\n🎉 Project ${chalk.bold(projectName)} created successfully!`));
      console.log(chalk.yellow(`\nNext steps:`));
      console.log(chalk.white(`  cd ${projectName}`));
      if (!installDeps) {
        console.log(chalk.white(`  npm run install-all`));
      }
      console.log(chalk.white(`  npm run dev\n`));

    } catch (err) {
      console.error(chalk.red('❌ Error creating project:'), err);
    }
  });

// Smart Resolution Helper for Web src directory
function resolveWebPath() {
  const cwd = process.cwd();

  if (fs.existsSync(path.join(cwd, 'web', 'src', 'pages'))) {
    return path.join(cwd, 'web', 'src', 'pages');
  }
  if (path.basename(cwd) === 'web' && fs.existsSync(path.join(cwd, 'src', 'pages'))) {
    return path.join(cwd, 'src', 'pages');
  }
  if (path.basename(cwd) === 'src' && path.basename(path.dirname(cwd)) === 'web') {
    return path.join(cwd, 'pages');
  }
  return path.join(cwd, 'src', 'pages');
}

// Smart Resolution Helper for API src directory and TS status
function resolveProjectPath() {
  const cwd = process.cwd();
  
  let apiSrcDir = '';
  let isTS = false;

  if (fs.existsSync(path.join(cwd, 'api', 'src'))) {
    // We are at project root
    apiSrcDir = path.join(cwd, 'api', 'src');
    isTS = fs.existsSync(path.join(cwd, 'api', 'tsconfig.json'));
  } else if (fs.existsSync(path.join(cwd, 'src')) && path.basename(cwd) === 'api') {
    // We are inside /api
    apiSrcDir = path.join(cwd, 'src');
    isTS = fs.existsSync(path.join(cwd, 'tsconfig.json'));
  } else if (path.basename(cwd) === 'src' && path.basename(path.dirname(cwd)) === 'api') {
    // We are inside /api/src
    apiSrcDir = cwd;
    isTS = fs.existsSync(path.join(path.dirname(cwd), 'tsconfig.json'));
  } else {
    // Fallback: assume src in cwd
    apiSrcDir = path.join(cwd, 'src');
    isTS = fs.existsSync(path.join(cwd, 'tsconfig.json'));
  }

  return { apiSrcDir, isTS };
}

// Scaffolding Generators
function generateModel(name, isTS) {
  const cap = name.charAt(0).toUpperCase() + name.slice(1);
  if (isTS) {
    return `import mongoose, { Schema, Document } from 'mongoose';

export interface I${cap} extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const ${cap}Schema: Schema = new Schema({
  name: { type: String, required: true },
}, { timestamps: true });

export const ${cap} = mongoose.model<I${cap}>('${cap}', ${cap}Schema);
`;
  } else {
    return `import mongoose from 'mongoose';

const ${cap}Schema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true });

export const ${cap} = mongoose.model('${cap}', ${cap}Schema);
`;
  }
}

function generateService(name, isTS) {
  const cap = name.charAt(0).toUpperCase() + name.slice(1);
  const camel = name.charAt(0).toLowerCase() + name.slice(1);
  if (isTS) {
    return `import { ${cap} } from '../models/${cap}.js';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export class ${cap}Service {
  static async getAll(options: PaginationOptions = {}) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = options.search ? { name: { $regex: options.search, $options: 'i' } } : {};

    const [data, total] = await Promise.all([
      ${cap}.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      ${cap}.countDocuments(filter)
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async getById(id: string) {
    return await ${cap}.findById(id);
  }

  static async create(data: { name: string }) {
    const ${camel} = new ${cap}(data);
    return await ${camel}.save();
  }

  static async update(id: string, data: Partial<{ name: string }>) {
    return await ${cap}.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id: string) {
    return await ${cap}.findByIdAndDelete(id);
  }
}
`;
  } else {
    return `import { ${cap} } from '../models/${cap}.js';

export class ${cap}Service {
  static async getAll(options = {}) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = options.search ? { name: { $regex: options.search, $options: 'i' } } : {};

    const [data, total] = await Promise.all([
      ${cap}.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      ${cap}.countDocuments(filter)
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async getById(id) {
    return await ${cap}.findById(id);
  }

  static async create(data) {
    const ${camel} = new ${cap}(data);
    return await ${camel}.save();
  }

  static async update(id, data) {
    return await ${cap}.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id) {
    return await ${cap}.findByIdAndDelete(id);
  }
}
`;
  }
}

function generateController(name, isTS) {
  const cap = name.charAt(0).toUpperCase() + name.slice(1);
  const camel = name.charAt(0).toLowerCase() + name.slice(1);
  if (isTS) {
    return `import { Request, Response, NextFunction } from 'express';
import { ${cap}Service } from '../services/${camel}Service.js';

export class ${cap}Controller {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const search = req.query.search ? String(req.query.search) : '';

      const result = await ${cap}Service.getAll({ page, limit, search });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const item = await ${cap}Service.getById(id);
      if (!item) return res.status(404).json({ message: '${cap} not found' });
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ${cap}Service.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const item = await ${cap}Service.update(id, req.body);
      if (!item) return res.status(404).json({ message: '${cap} not found' });
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const item = await ${cap}Service.delete(id);
      if (!item) return res.status(404).json({ message: '${cap} not found' });
      res.json({ message: '${cap} deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}
`;
  } else {
    return `import { ${cap}Service } from '../services/${camel}Service.js';

export class ${cap}Controller {
  static async getAll(req, res, next) {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const search = req.query.search ? String(req.query.search) : '';

      const result = await ${cap}Service.getAll({ page, limit, search });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const item = await ${cap}Service.getById(req.params.id);
      if (!item) return res.status(404).json({ message: '${cap} not found' });
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const item = await ${cap}Service.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const item = await ${cap}Service.update(req.params.id, req.body);
      if (!item) return res.status(404).json({ message: '${cap} not found' });
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const item = await ${cap}Service.delete(req.params.id);
      if (!item) return res.status(404).json({ message: '${cap} not found' });
      res.json({ message: '${cap} deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}
`;
  }
}

function generateRoute(name, isTS) {
  const cap = name.charAt(0).toUpperCase() + name.slice(1);
  const camel = name.charAt(0).toLowerCase() + name.slice(1);
  if (isTS) {
    return `import { Router } from 'express';
import { ${cap}Controller } from '../controllers/${camel}Controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

const create${cap}Schema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
});

router.get('/', ${cap}Controller.getAll);
router.get('/:id', ${cap}Controller.getById);
const update${cap}Schema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
  }),
});

router.post('/', validate(create${cap}Schema), ${cap}Controller.create);
router.put('/:id', validate(update${cap}Schema), ${cap}Controller.update);
router.delete('/:id', ${cap}Controller.delete);

export default router;
`;
  } else {
    return `import { Router } from 'express';
import { ${cap}Controller } from '../controllers/${camel}Controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

const create${cap}Schema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
});

router.get('/', ${cap}Controller.getAll);
router.get('/:id', ${cap}Controller.getById);
const update${cap}Schema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
  }),
});

router.post('/', validate(create${cap}Schema), ${cap}Controller.create);
router.put('/:id', validate(update${cap}Schema), ${cap}Controller.update);
router.delete('/:id', ${cap}Controller.delete);

export default router;
`;
  }
}

function generateMiddleware(name, isTS) {
  const cap = name.charAt(0).toUpperCase() + name.slice(1);
  const camel = name.charAt(0).toLowerCase() + name.slice(1);
  if (isTS) {
    return `import { Request, Response, NextFunction } from 'express';

export const ${camel}Middleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Custom logic here
    next();
  } catch (err) {
    next(err);
  }
};
`;
  } else {
    return `export const ${camel}Middleware = (req, res, next) => {
  try {
    // Custom logic here
    next();
  } catch (err) {
    next(err);
  }
};
`;
  }
}

function generatePage(name, isTS) {
  const cap = name.charAt(0).toUpperCase() + name.slice(1);
  const camel = name.charAt(0).toLowerCase() + name.slice(1);
  if (isTS) {
    return `import React, { useState, useEffect } from 'react';
import { ApexTable, ApexTableColumn } from 'react-apextable-pro';
import Swal from 'sweetalert2';
import { Edit2, Trash2 } from 'lucide-react';
import { Dropdown } from '../components/Dropdown';
import { api } from '../api/client';

interface ${cap}Item {
  _id?: string;
  name: string;
  createdAt?: string;
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#0e1117',
  color: '#f8fafc',
});

export default function ${cap}Page() {
  const [items, setItems] = useState<${cap}Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<${cap}Item | null>(null);
  const [nameInput, setNameInput] = useState('');

  const fetchItems = () => {
    setLoading(true);
    api.resource('${camel}s').safe().get()
      .then((res: any) => {
        if (res.ok && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
          setItems(list);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setNameInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ${cap}Item) => {
    setEditingItem(item);
    setNameInput(item.name);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    if (editingItem && editingItem._id) {
      const res: any = await api.resource(\`${camel}s/\${editingItem._id}\`).safe().put({ name: nameInput });
      if (res.ok) {
        Toast.fire({ icon: 'success', title: '${cap} updated successfully!' });
        setIsModalOpen(false);
        fetchItems();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.data?.message || 'Failed to update item', background: '#0e1117', color: '#fff' });
      }
    } else {
      const res: any = await api.resource('${camel}s').safe().post({ name: nameInput });
      if (res.ok) {
        Toast.fire({ icon: 'success', title: '${cap} created successfully!' });
        setIsModalOpen(false);
        fetchItems();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.data?.message || 'Failed to create item', background: '#0e1117', color: '#fff' });
      }
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this ${camel}?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#1e2430',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#0e1117',
      color: '#ffffff',
    });

    if (result.isConfirmed) {
      const res: any = await api.resource(\`${camel}s/\${id}\`).safe().delete();
      if (res.ok) {
        Toast.fire({ icon: 'success', title: '${cap} deleted successfully!' });
        fetchItems();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.data?.message || 'Failed to delete item', background: '#0e1117', color: '#fff' });
      }
    }
  };

  const columns: ApexTableColumn<${cap}Item>[] = [
    { name: 'Name', selector: row => row.name, sortable: true },
    {
      name: 'Actions',
      cell: (row: ${cap}Item) => (
        <Dropdown>
          <Dropdown.Trigger />
          <Dropdown.Content>
            <Dropdown.Item onClick={() => handleOpenEdit(row)} className="text-[#ffd000]">
              <Edit2 size={15} /> Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleDelete(row._id)} className="text-[#f43f5e]">
              <Trash2 size={15} /> Delete
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-6 shadow-2xl flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-white">${cap} Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage ${camel} resources</p>
        </div>
        <button onClick={handleOpenCreate} className="px-4 py-2 bg-[#ffd000] hover:bg-[#ffe45e] text-black font-bold text-xs rounded-md shadow-sm transition-colors cursor-pointer">
          + New ${cap}
        </button>
      </div>

      <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-6 shadow-2xl">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-mono">Loading...</div>
        ) : (
          <ApexTable datos={items} columnas={columns} storagePrefix="dstack_${camel}_" pagination />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-display font-bold text-white mb-4">{editingItem ? 'Edit ${cap}' : 'Create ${cap}'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1 uppercase tracking-wider">Name</label>
                <input type="text" required value={nameInput} onChange={e => setNameInput(e.target.value)} className="w-full bg-[#07090d] text-white px-3.5 py-2 text-xs rounded-md border border-[#1c222d] focus:outline-none focus:border-[#ffd000]" placeholder="Enter name..." />
              </div>
              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#1c222d] mt-5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-2 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#ffd000] hover:bg-[#ffe45e] text-black font-bold text-xs rounded-md transition-colors cursor-pointer">
                  {editingItem ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;
  } else {
    return `import { useState, useEffect } from 'react';
import { ApexTable } from 'react-apextable-pro';
import Swal from 'sweetalert2';
import { Edit2, Trash2 } from 'lucide-react';
import { Dropdown } from '../components/Dropdown';
import { api } from '../api/client';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#0e1117',
  color: '#f8fafc',
});

export default function ${cap}Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [nameInput, setNameInput] = useState('');

  const fetchItems = () => {
    setLoading(true);
    api.resource('${camel}s').safe().get()
      .then((res) => {
        if (res.ok && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
          setItems(list);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setNameInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setNameInput(item.name);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    if (editingItem && editingItem._id) {
      const res = await api.resource(\`${camel}s/\${editingItem._id}\`).safe().put({ name: nameInput });
      if (res.ok) {
        Toast.fire({ icon: 'success', title: '${cap} updated successfully!' });
        setIsModalOpen(false);
        fetchItems();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.data?.message || 'Failed to update item', background: '#0e1117', color: '#fff' });
      }
    } else {
      const res = await api.resource('${camel}s').safe().post({ name: nameInput });
      if (res.ok) {
        Toast.fire({ icon: 'success', title: '${cap} created successfully!' });
        setIsModalOpen(false);
        fetchItems();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.data?.message || 'Failed to create item', background: '#0e1117', color: '#fff' });
      }
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this ${camel}?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#1e2430',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#0e1117',
      color: '#ffffff',
    });

    if (result.isConfirmed) {
      const res = await api.resource(\`${camel}s/\${id}\`).safe().delete();
      if (res.ok) {
        Toast.fire({ icon: 'success', title: '${cap} deleted successfully!' });
        fetchItems();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.data?.message || 'Failed to delete item', background: '#0e1117', color: '#fff' });
      }
    }
  };

  const columns = [
    { name: 'Name', selector: row => row.name, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <Dropdown>
          <Dropdown.Trigger />
          <Dropdown.Content>
            <Dropdown.Item onClick={() => handleOpenEdit(row)} className="text-[#ffd000]">
              <Edit2 size={15} /> Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleDelete(row._id)} className="text-[#f43f5e]">
              <Trash2 size={15} /> Delete
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-6 shadow-2xl flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-white">${cap} Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage ${camel} resources</p>
        </div>
        <button onClick={handleOpenCreate} className="px-4 py-2 bg-[#ffd000] hover:bg-[#ffe45e] text-black font-bold text-xs rounded-md shadow-sm transition-colors cursor-pointer">
          + New ${cap}
        </button>
      </div>

      <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-6 shadow-2xl">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-mono">Loading...</div>
        ) : (
          <ApexTable datos={items} columnas={columns} storagePrefix="dstack_${camel}_" pagination />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0e1117] border border-[#1c222d] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-display font-bold text-white mb-4">{editingItem ? 'Edit ${cap}' : 'Create ${cap}'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-mono mb-1 uppercase tracking-wider">Name</label>
                <input type="text" required value={nameInput} onChange={e => setNameInput(e.target.value)} className="w-full bg-[#07090d] text-white px-3.5 py-2 text-xs rounded-md border border-[#1c222d] focus:outline-none focus:border-[#ffd000]" placeholder="Enter name..." />
              </div>
              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#1c222d] mt-5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-2 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#ffd000] hover:bg-[#ffe45e] text-black font-bold text-xs rounded-md transition-colors cursor-pointer">
                  {editingItem ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;
  }
}

// Auto-injection Helpers
function injectServerRoute(apiSrcDir, camelName, isTS) {
  const ext = isTS ? 'ts' : 'js';
  const serverPath = path.join(apiSrcDir, `server.${ext}`);
  if (!fs.existsSync(serverPath)) return false;

  let content = fs.readFileSync(serverPath, 'utf-8');
  const routeImport = `import ${camelName}Routes from './routes/${camelName}Routes.js';`;
  const routeMount = `app.use('/api/${camelName}s', ${camelName}Routes);`;

  if (content.includes(routeImport) || content.includes(routeMount)) {
    return false;
  }

  if (content.includes("import resourceRoutes from './routes/resourceRoutes.js';")) {
    content = content.replace(
      "import resourceRoutes from './routes/resourceRoutes.js';",
      `import resourceRoutes from './routes/resourceRoutes.js';\n${routeImport}`
    );
  } else if (content.includes('// Routes')) {
    content = content.replace(
      '// Routes',
      `// Routes\n${routeImport}`
    );
  } else {
    content = `${routeImport}\n${content}`;
  }

  if (content.includes("app.use('/api/resources', resourceRoutes);")) {
    content = content.replace(
      "app.use('/api/resources', resourceRoutes);",
      `app.use('/api/resources', resourceRoutes);\napp.use('/api/${camelName}s', ${camelName}Routes);`
    );
  } else if (content.includes('// API Routes')) {
    content = content.replace(
      '// API Routes',
      `// API Routes\napp.use('/api/${camelName}s', ${camelName}Routes);`
    );
  } else {
    content = content.replace(
      'app.listen',
      `app.use('/api/${camelName}s', ${camelName}Routes);\n\napp.listen`
    );
  }

  fs.writeFileSync(serverPath, content);
  return true;
}

function injectWebAppRoute(webPagesDir, capitalizedName, camelName, isTS) {
  const webSrcDir = path.dirname(webPagesDir);
  const appPathTS = path.join(webSrcDir, 'App.tsx');
  const appPathJS = path.join(webSrcDir, 'App.jsx');
  const appPath = fs.existsSync(appPathTS) ? appPathTS : (fs.existsSync(appPathJS) ? appPathJS : null);
  if (!appPath) return false;

  let content = fs.readFileSync(appPath, 'utf-8');
  const pageImport = `import ${capitalizedName}Page from './pages/${capitalizedName}Page';`;
  const routeElement = `<Route path="/${camelName}s" element={<${capitalizedName}Page />} />`;

  if (content.includes(pageImport) || content.includes(routeElement)) {
    return false;
  }

  if (content.includes("import SettingsPage from './pages/SettingsPage';")) {
    content = content.replace(
      "import SettingsPage from './pages/SettingsPage';",
      `import SettingsPage from './pages/SettingsPage';\n${pageImport}`
    );
  } else {
    const lines = content.split('\n');
    const lastImportIdx = lines.findLastIndex(l => l.startsWith('import '));
    if (lastImportIdx !== -1) {
      lines.splice(lastImportIdx + 1, 0, pageImport);
      content = lines.join('\n');
    } else {
      content = `${pageImport}\n${content}`;
    }
  }

  if (content.includes('<Route path="/settings" element={<SettingsPage />} />')) {
    content = content.replace(
      '<Route path="/settings" element={<SettingsPage />} />',
      `<Route path="/settings" element={<SettingsPage />} />\n          ${routeElement}`
    );
  } else if (content.includes('</Route>')) {
    content = content.replace(
      '</Route>',
      `  ${routeElement}\n        </Route>`
    );
  }

  fs.writeFileSync(appPath, content);
  return true;
}

function ejectServerRoute(apiSrcDir, camelName, isTS) {
  const ext = isTS ? 'ts' : 'js';
  const serverPath = path.join(apiSrcDir, `server.${ext}`);
  if (!fs.existsSync(serverPath)) return false;

  let content = fs.readFileSync(serverPath, 'utf-8');
  const routeImportPattern = new RegExp(`import\\s+${camelName}Routes\\s+from\\s+['"]\\./routes/${camelName}Routes\\.js['"];?\\r?\\n?`, 'g');
  const routeMountPattern = new RegExp(`app\\.use\\(['"]\\/api\\/${camelName}s['"],\\s*${camelName}Routes\\);?\\r?\\n?`, 'g');

  content = content.replace(routeImportPattern, '').replace(routeMountPattern, '');
  fs.writeFileSync(serverPath, content);
  return true;
}

function ejectWebAppRoute(webPagesDir, capitalizedName, camelName, isTS) {
  const webSrcDir = path.dirname(webPagesDir);
  const appPathTS = path.join(webSrcDir, 'App.tsx');
  const appPathJS = path.join(webSrcDir, 'App.jsx');
  const appPath = fs.existsSync(appPathTS) ? appPathTS : (fs.existsSync(appPathJS) ? appPathJS : null);
  if (!appPath) return false;

  let content = fs.readFileSync(appPath, 'utf-8');
  const pageImportPattern = new RegExp(`import\\s+${capitalizedName}Page\\s+from\\s+['"]\\./pages/${capitalizedName}Page['"];?\\r?\\n?`, 'g');
  const routeElementPattern = new RegExp(`<Route\\s+path=["']\\/${camelName}s["']\\s+element={<${capitalizedName}Page\\s*\\/>}\\s*\\/>?\\r?\\n?`, 'g');

  content = content.replace(pageImportPattern, '').replace(routeElementPattern, '');
  fs.writeFileSync(appPath, content);
  return true;
}

function generateRegisterPage(isTS) {
  if (isTS) {
    return `import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res: any = await api.resource('auth/register').safe().post({ name, email, password });
      if (res.ok && res.data) {
        // The API sets an httpOnly session cookie; just enter the app.
        window.location.href = '/dashboard';
      } else {
        setError(res.error?.message || res.data?.message || 'Error en el registro');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión durante el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="grid-bg" />
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Zap size={22} color="#000" strokeWidth={2.5} />
          </div>
          <h1 className="auth-title">Crear Cuenta <span className="text-[#ffd000]">D-Stack</span></h1>
          <p className="auth-subtitle">Regístrate para comenzar a administrar el monolito</p>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <div className="input-wrapper">
              <User className="input-icon" size={16} />
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="form-input" 
                placeholder="Tu Nombre" 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={16} />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="form-input" 
                placeholder="usuario@dstack.com" 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="form-input" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            <span>{loading ? 'Registrando...' : 'Crear Cuenta'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-6">
          ¿Ya tienes cuenta? <Link to="/login" className="text-[#ffd000] font-semibold hover:underline">Iniciar Sesión</Link>
        </p>
      </div>
    </div>
  );
}
`;
  } else {
    return `import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.resource('auth/register').safe().post({ name, email, password });
      if (res.ok && res.data) {
        // The API sets an httpOnly session cookie; just enter the app.
        window.location.href = '/dashboard';
      } else {
        setError(res.error?.message || res.data?.message || 'Error en el registro');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión durante el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="grid-bg" />
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Zap size={22} color="#000" strokeWidth={2.5} />
          </div>
          <h1 className="auth-title">Crear Cuenta <span className="text-[#ffd000]">D-Stack</span></h1>
          <p className="auth-subtitle">Regístrate para comenzar a administrar el monolito</p>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <div className="input-wrapper">
              <User className="input-icon" size={16} />
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="form-input" 
                placeholder="Tu Nombre" 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={16} />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="form-input" 
                placeholder="usuario@dstack.com" 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="form-input" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            <span>{loading ? 'Registrando...' : 'Crear Cuenta'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-6">
          ¿Ya tienes cuenta? <Link to="/login" className="text-[#ffd000] font-semibold hover:underline">Iniciar Sesión</Link>
        </p>
      </div>
    </div>
  );
}
`;
  }
}

// --- Auth module backend scaffolding (register / me / logout endpoints) ---

function generateAuthRoutesFile(isTS) {
  return `import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

// Validation Schemas
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Must be a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Must be a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', AuthController.me);
router.post('/logout', AuthController.logout);

export default router;
`;
}

function generateAuthControllerFile(isTS) {
  if (isTS) {
    return `import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { logger } from '../middleware/logger.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000,
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;
    try {
      const user = await AuthService.register({ name, email, password });
      const token = await AuthService.generateToken(user);
      res.cookie('token', token, COOKIE_OPTIONS);

      res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (err) {
      logger.error('Register error: ' + err);
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const user = await AuthService.validateCredentials(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = await AuthService.generateToken(user);
      res.cookie('token', token, COOKIE_OPTIONS);

      res.json({
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (err) {
      logger.error('Login error: ' + err);
      next(err);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const bearer = req.header('Authorization') || '';
      const token = req.cookies?.token || bearer.replace(/^Bearer\\s+/, '') || null;
      const user = await AuthService.getUserFromRequest(token);

      res.json({
        user: user ? { id: user._id, name: user.name, email: user.email } : null
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' as const });
    res.json({ message: 'Logged out successfully' });
  }
}
`;
  }
  return `import { AuthService } from '../services/authService.js';
import { logger } from '../middleware/logger.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000,
};

export class AuthController {
  static async register(req, res, next) {
    const { name, email, password } = req.body;
    try {
      const user = await AuthService.register({ name, email, password });
      const token = await AuthService.generateToken(user);
      res.cookie('token', token, COOKIE_OPTIONS);

      res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (err) {
      logger.error('Register error: ' + err);
      next(err);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await AuthService.validateCredentials(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = await AuthService.generateToken(user);
      res.cookie('token', token, COOKIE_OPTIONS);

      res.json({
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (err) {
      logger.error('Login error: ' + err);
      next(err);
    }
  }

  static async me(req, res, next) {
    try {
      const bearer = req.header('Authorization') || '';
      const token = req.cookies?.token || bearer.replace(/^Bearer\\s+/, '') || null;
      const user = await AuthService.getUserFromRequest(token);

      res.json({
        user: user ? { id: user._id, name: user.name, email: user.email } : null
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res) {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
    res.json({ message: 'Logged out successfully' });
  }
}
`;
}

function generateAuthServiceFile(isTS) {
  if (isTS) {
    return `import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  static async generateToken(user: IUser): Promise<string> {
    return jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
  }

  static async validateCredentials(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null;

    return user;
  }

  static async register(data: { name: string; email: string; password: string }) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      const err: any = new Error('Email is already registered');
      err.statusCode = 409;
      throw err;
    }
    const user = new User(data);
    return await user.save();
  }

  static async getUserFromRequest(token: string | null) {
    if (!token) return null;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      return await User.findById(decoded.id);
    } catch {
      return null;
    }
  }
}
`;
  }
  return `import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  static async generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
  }

  static async validateCredentials(email, password) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null;

    return user;
  }

  static async register(data) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      const err = new Error('Email is already registered');
      err.statusCode = 409;
      throw err;
    }
    const user = new User(data);
    return await user.save();
  }

  static async getUserFromRequest(token) {
    if (!token) return null;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return await User.findById(decoded.id);
    } catch {
      return null;
    }
  }
}
`;
}

// Ensure the backend exposes register / me / logout auth endpoints (idempotent)
function ensureAuthBackend(apiSrcDir, isTS) {
  const ext = isTS ? 'ts' : 'js';

  const routesPath = path.join(apiSrcDir, 'routes', `authRoutes.${ext}`);
  if (fs.existsSync(routesPath) && fs.readFileSync(routesPath, 'utf-8').includes("'/register'")) {
    console.log(chalk.yellow(`⚠️ Auth endpoints already present in routes/authRoutes.${ext}. Skipping.`));
  } else {
    if (fs.existsSync(routesPath)) {
      console.log(chalk.yellow(`⚠️ Replacing routes/authRoutes.${ext} with the standard auth module.`));
    }
    fs.ensureDirSync(path.join(apiSrcDir, 'routes'));
    fs.writeFileSync(routesPath, generateAuthRoutesFile(isTS));
    console.log(chalk.green(`✅ Auth routes ready: /api/auth/register, /login, /me, /logout`));
  }

  const controllerPath = path.join(apiSrcDir, 'controllers', `authController.${ext}`);
  if (fs.existsSync(controllerPath) && fs.readFileSync(controllerPath, 'utf-8').includes('static async register')) {
    console.log(chalk.yellow(`⚠️ Auth handlers already present in controllers/authController.${ext}. Skipping.`));
  } else {
    if (fs.existsSync(controllerPath)) {
      console.log(chalk.yellow(`⚠️ Replacing controllers/authController.${ext} with the standard auth module.`));
    }
    fs.ensureDirSync(path.join(apiSrcDir, 'controllers'));
    fs.writeFileSync(controllerPath, generateAuthControllerFile(isTS));
    console.log(chalk.green(`✅ Auth controller ready: register, login, me, logout`));
  }

  const servicePath = path.join(apiSrcDir, 'services', `authService.${ext}`);
  if (fs.existsSync(servicePath) && fs.readFileSync(servicePath, 'utf-8').includes('static async getUserFromRequest')) {
    console.log(chalk.yellow(`⚠️ Auth service already up to date in services/authService.${ext}. Skipping.`));
  } else {
    if (fs.existsSync(servicePath)) {
      console.log(chalk.yellow(`⚠️ Replacing services/authService.${ext} with the standard auth module.`));
    }
    fs.ensureDirSync(path.join(apiSrcDir, 'services'));
    fs.writeFileSync(servicePath, generateAuthServiceFile(isTS));
    console.log(chalk.green(`✅ Auth service ready: validateCredentials, register, generateToken, getUserFromRequest`));
  }
}

// Generate Command
program
  .command('generate')
  .alias('g')
  .description('Generate a new component (model, controller, service, route, middleware, resource, auth)')
  .argument('<type>', 'Component type: model, controller, service, route, middleware, resource, auth')
  .argument('[name]', 'Name of the component')
  .action(async (type, name) => {
    const validTypes = ['model', 'controller', 'service', 'route', 'middleware', 'resource', 'res', 'auth'];
    const normalizedType = type.toLowerCase();

    if (!validTypes.includes(normalizedType)) {
      console.error(chalk.red(`❌ Invalid type "${type}". Allowed types: ${validTypes.join(', ')}`));
      process.exit(1);
    }

    if (normalizedType !== 'auth' && !name) {
      console.error(chalk.red(`❌ Component name is required for type "${type}".`));
      process.exit(1);
    }

    const { apiSrcDir, isTS } = resolveProjectPath();
    const ext = isTS ? 'ts' : 'js';
    const webPagesDir = resolveWebPath();
    const webExt = isTS ? 'tsx' : 'jsx';

    const targetName = name || 'Auth';
    const capitalizedName = targetName.charAt(0).toUpperCase() + targetName.slice(1);
    const camelName = targetName.charAt(0).toLowerCase() + targetName.slice(1);

    const createFile = (subfolder, filename, content) => {
      const folderPath = path.join(apiSrcDir, subfolder);
      const filePath = path.join(folderPath, filename);

      if (fs.existsSync(filePath)) {
        console.log(chalk.yellow(`⚠️ Warning: ${filename} already exists. Skipping.`));
        return false;
      }

      fs.ensureDirSync(folderPath);
      fs.writeFileSync(filePath, content);
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(chalk.green(`✅ Created ${subfolder.slice(0, -1)}: ${chalk.bold(relativePath)}`));
      return true;
    };

    if (normalizedType === 'auth') {
      console.log(chalk.cyan(`\n⚡ Scaffolding Auth Module...\n`));
      const regPagePath = path.join(webPagesDir, `RegisterPage.${webExt}`);
      if (!fs.existsSync(regPagePath)) {
        fs.ensureDirSync(webPagesDir);
        fs.writeFileSync(regPagePath, generateRegisterPage(isTS));
        console.log(chalk.green(`✅ Created page: ${chalk.bold(path.relative(process.cwd(), regPagePath))}`));
      }

      const webSrcDir = path.dirname(webPagesDir);
      const appPathTS = path.join(webSrcDir, 'App.tsx');
      const appPathJS = path.join(webSrcDir, 'App.jsx');
      const appPath = fs.existsSync(appPathTS) ? appPathTS : (fs.existsSync(appPathJS) ? appPathJS : null);

      if (appPath) {
        let appContent = fs.readFileSync(appPath, 'utf-8');
        if (!appContent.includes("import RegisterPage from './pages/RegisterPage';")) {
          appContent = appContent.replace(
            "import Login from './pages/Login';",
            "import Login from './pages/Login';\nimport RegisterPage from './pages/RegisterPage';"
          );
          appContent = appContent.replace(
            /<Route\s+path=["']\/login["']/,
            (match) => `<Route path="/register" element={<RegisterPage />} />\n        ${match}`
          );
          fs.writeFileSync(appPath, appContent);
          console.log(chalk.green(`✅ Auto-registered /register route in App.${webExt}`));
        }
      }

      // Ensure the backend exposes /api/auth/register, /me and /logout
      ensureAuthBackend(apiSrcDir, isTS);

      console.log(chalk.green(`\n🎉 Auth Module successfully scaffolded!\n`));
      return;
    }

    if (normalizedType === 'resource' || normalizedType === 'res') {
      console.log(chalk.cyan(`\n⚡ Scaffolding resource "${capitalizedName}"...\n`));
      createFile('models', `${capitalizedName}.${ext}`, generateModel(name, isTS));
      createFile('services', `${camelName}Service.${ext}`, generateService(name, isTS));
      createFile('controllers', `${camelName}Controller.${ext}`, generateController(name, isTS));
      createFile('routes', `${camelName}Routes.${ext}`, generateRoute(name, isTS));

      // Create frontend page
      const pagePath = path.join(webPagesDir, `${capitalizedName}Page.${webExt}`);

      if (fs.existsSync(pagePath)) {
        console.log(chalk.yellow(`⚠️ Warning: ${capitalizedName}Page.${webExt} already exists. Skipping.`));
      } else {
        fs.ensureDirSync(webPagesDir);
        fs.writeFileSync(pagePath, generatePage(name, isTS));
        const relativePagePath = path.relative(process.cwd(), pagePath);
        console.log(chalk.green(`✅ Created page: ${chalk.bold(relativePagePath)}`));
      }

      // Auto-inject routes
      const serverInjected = injectServerRoute(apiSrcDir, camelName, isTS);
      const appInjected = injectWebAppRoute(webPagesDir, capitalizedName, camelName, isTS);

      if (serverInjected) {
        console.log(chalk.green(`✅ Auto-registered route in server.${ext}: ${chalk.bold(`app.use('/api/${camelName}s', ${camelName}Routes)`)}`));
      } else {
        console.log(chalk.magenta(`\n💡 Mount route in server.${ext}:`));
        console.log(chalk.gray(`   import ${camelName}Routes from './routes/${camelName}Routes.js';`));
        console.log(chalk.gray(`   app.use('/api/${camelName}s', ${camelName}Routes);`));
      }

      if (appInjected) {
        console.log(chalk.green(`✅ Auto-registered page in App.${webExt}: ${chalk.bold(`<Route path="/${camelName}s" element={<${capitalizedName}Page />} />\n`)}`));
      } else {
        console.log(chalk.magenta(`💡 Page route in App.${webExt}:`));
        console.log(chalk.gray(`   import ${capitalizedName}Page from './pages/${capitalizedName}Page';`));
        console.log(chalk.gray(`   <Route path="/${camelName}s" element={<${capitalizedName}Page />} />\n`));
      }
    } else {
      let content = '';
      let folder = '';
      let filename = '';

      switch (normalizedType) {
        case 'model':
          folder = 'models';
          filename = `${capitalizedName}.${ext}`;
          content = generateModel(name, isTS);
          break;
        case 'service':
          folder = 'services';
          filename = `${camelName}Service.${ext}`;
          content = generateService(name, isTS);
          break;
        case 'controller':
          folder = 'controllers';
          filename = `${camelName}Controller.${ext}`;
          content = generateController(name, isTS);
          break;
        case 'route':
          folder = 'routes';
          filename = `${camelName}Routes.${ext}`;
          content = generateRoute(name, isTS);
          break;
        case 'middleware':
          folder = 'middleware';
          filename = `${camelName}Middleware.${ext}`;
          content = generateMiddleware(name, isTS);
          break;
      }

      createFile(folder, filename, content);
    }
  });

// Remove Command
program
  .command('remove')
  .alias('rm')
  .description('Remove a scaffolded component or resource')
  .argument('<type>', 'Component type: resource, auth')
  .argument('[name]', 'Name of the component to remove')
  .action(async (type, name) => {
    const { apiSrcDir, isTS } = resolveProjectPath();
    const ext = isTS ? 'ts' : 'js';
    const webPagesDir = resolveWebPath();
    const webExt = isTS ? 'tsx' : 'jsx';

    const normalizedType = type.toLowerCase();
    if (normalizedType === 'auth') {
      const regPagePath = path.join(webPagesDir, `RegisterPage.${webExt}`);
      if (fs.existsSync(regPagePath)) {
        fs.removeSync(regPagePath);
        console.log(chalk.red(`🗑️ Removed: ${path.relative(process.cwd(), regPagePath)}`));
      }

      const webSrcDir = path.dirname(webPagesDir);
      const appPathTS = path.join(webSrcDir, 'App.tsx');
      const appPathJS = path.join(webSrcDir, 'App.jsx');
      const appPath = fs.existsSync(appPathTS) ? appPathTS : (fs.existsSync(appPathJS) ? appPathJS : null);

      if (appPath) {
        let appContent = fs.readFileSync(appPath, 'utf-8');
        const importPattern = /import\s+RegisterPage\s+from\s+['"]\.\/pages\/RegisterPage['"];?\r?\n?/g;
        const routePattern = /<Route\s+path=["']\/register["']\s+element={<RegisterPage\s*\/>}\s*\/?>\s*\r?\n?/g;
        const updated = appContent.replace(importPattern, '').replace(routePattern, '');
        if (updated !== appContent) {
          fs.writeFileSync(appPath, updated);
          console.log(chalk.green(`✅ Un-registered /register route in App.${webExt}`));
        }
      }

      console.log(chalk.green(`\n✅ Auth module removed successfully!\n`));
      return;
    }

    if (normalizedType === 'resource' || normalizedType === 'res') {
      if (!name) {
        console.error(chalk.red('❌ Resource name is required to remove.'));
        process.exit(1);
      }
      const cap = name.charAt(0).toUpperCase() + name.slice(1);
      const camel = name.charAt(0).toLowerCase() + name.slice(1);

      const filesToRemove = [
        path.join(apiSrcDir, 'models', `${cap}.${ext}`),
        path.join(apiSrcDir, 'services', `${camel}Service.${ext}`),
        path.join(apiSrcDir, 'controllers', `${camel}Controller.${ext}`),
        path.join(apiSrcDir, 'routes', `${camel}Routes.${ext}`),
        path.join(webPagesDir, `${cap}Page.${webExt}`),
      ];

      filesToRemove.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          fs.removeSync(filePath);
          console.log(chalk.red(`🗑️ Removed: ${path.relative(process.cwd(), filePath)}`));
        }
      });

      ejectServerRoute(apiSrcDir, camel, isTS);
      ejectWebAppRoute(webPagesDir, cap, camel, isTS);

      console.log(chalk.green(`\n✅ Resource "${cap}" removed successfully!\n`));
      return;
    }

    console.error(chalk.red(`❌ Invalid type "${type}". Allowed types: resource, auth`));
    process.exit(1);
  });

// Doctor Command
program
  .command('doctor')
  .description('Check workspace requirements, Node version, and MongoDB connection')
  .action(async () => {
    showBanner();
    console.log(chalk.cyan('🩺 Running D-Stack System Diagnostic...\n'));

    // 1. Node.js check
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);
    if (majorVersion >= 18) {
      console.log(chalk.green(`  ✅ Node.js Version: ${nodeVersion} (Supported)`));
    } else {
      console.log(chalk.red(`  ❌ Node.js Version: ${nodeVersion} (v18+ recommended)`));
    }

    // 2. npm check
    const npmVersion = shell.exec('npm -v', { silent: true }).stdout.trim();
    if (npmVersion) {
      console.log(chalk.green(`  ✅ npm Version: ${npmVersion}`));
    } else {
      console.log(chalk.red(`  ❌ npm not found`));
    }

    // 3. Project Structure check
    const cwd = process.cwd();
    const isDStackApp = fs.existsSync(path.join(cwd, 'api')) && fs.existsSync(path.join(cwd, 'web'));
    if (isDStackApp) {
      console.log(chalk.green(`  ✅ Workspace: D-Stack App detected (${cwd})`));
    } else {
      console.log(chalk.yellow(`  ⚠️ Workspace: Not currently inside a D-Stack app root directory.`));
    }

    // 4. MongoDB Socket check (localhost:27017)
    console.log(chalk.gray(`  🔍 Checking local MongoDB service (localhost:27017)...`));
    const checkMongo = new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1500);
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });
      socket.connect(27017, '127.0.0.1');
    });

    const isMongoRunning = await checkMongo;
    if (isMongoRunning) {
      console.log(chalk.green(`  ✅ MongoDB: Service detected running on port 27017`));
    } else {
      console.log(chalk.yellow(`  ⚠️ MongoDB: Local instance not detected on 127.0.0.1:27017 (Ensure MongoDB Atlas URI or local service is configured in .env)`));
    }

    console.log(chalk.cyan(`\n✨ Diagnostic completed!\n`));
  });

program.parse(process.argv);
