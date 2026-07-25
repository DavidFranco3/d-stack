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
  .version('1.0.0');

// Initialize Command
program
  .command('init')
  .description('Initialize a new D-Stack project')
  .argument('[name]', 'Project name')
  .action(async (name) => {
    showBanner();
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

    questions.push({
      type: 'list',
      name: 'language',
      message: 'Select language:',
      choices: [
        { name: 'TypeScript (Recommended)', value: 'TypeScript' },
        { name: 'JavaScript', value: 'JavaScript' },
      ],
    });

    questions.push({
      type: 'confirm',
      name: 'installDeps',
      message: 'Would you like to install dependencies automatically?',
      default: true,
    });

    const answers = await inquirer.prompt(questions);
    const projectName = name || answers.projectName;
    const isTS = answers.language === 'TypeScript';
    const languageFolder = isTS ? 'ts' : 'js';

    const targetPath = path.join(process.cwd(), projectName);
    const templatePath = path.join(__dirname, '../templates', languageFolder);

    console.log(chalk.cyan(`\n🚀 Initializing ${chalk.bold(projectName)} in ${chalk.yellow(answers.language)}...\n`));

    try {
      if (fs.existsSync(targetPath)) {
        console.error(chalk.red(`❌ Error: Directory "${projectName}" already exists.`));
        process.exit(1);
      }

      // Copy template
      await fs.copy(templatePath, targetPath);

      // Update project name in root package.json
      const packageJsonPath = path.join(targetPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkg = await fs.readJson(packageJsonPath);
        pkg.name = projectName;
        await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
      }

      // Install dependencies if requested
      if (answers.installDeps) {
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
      if (!answers.installDeps) {
        console.log(chalk.white(`  npm run install-all`));
      }
      console.log(chalk.white(`  npm run dev\n`));

    } catch (err) {
      console.error(chalk.red('❌ Error creating project:'), err);
    }
  });

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

export class ${cap}Service {
  static async getAll() {
    return await ${cap}.find();
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
  static async getAll() {
    return await ${cap}.find();
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
      const items = await ${cap}Service.getAll();
      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ${cap}Service.getById(req.params.id);
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
      const item = await ${cap}Service.update(req.params.id, req.body);
      if (!item) return res.status(404).json({ message: '${cap} not found' });
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
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
  } else {
    return `import { ${cap}Service } from '../services/${camel}Service.js';

export class ${cap}Controller {
  static async getAll(req, res, next) {
    try {
      const items = await ${cap}Service.getAll();
      res.json(items);
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
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const create${cap}Schema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
});

router.get('/', ${cap}Controller.getAll);
router.get('/:id', ${cap}Controller.getById);
router.post('/', validate(create${cap}Schema), ${cap}Controller.create);
router.put('/:id', ${cap}Controller.update);
router.delete('/:id', ${cap}Controller.delete);

export default router;
`;
  } else {
    return `import { Router } from 'express';
import { ${cap}Controller } from '../controllers/${camel}Controller.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const create${cap}Schema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
});

router.get('/', ${cap}Controller.getAll);
router.get('/:id', ${cap}Controller.getById);
router.post('/', validate(create${cap}Schema), ${cap}Controller.create);
router.put('/:id', ${cap}Controller.update);
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

// Generate Command
program
  .command('generate')
  .alias('g')
  .description('Generate a new component (model, controller, service, route, middleware, resource)')
  .argument('<type>', 'Component type: model, controller, service, route, middleware, resource')
  .argument('<name>', 'Name of the component')
  .action(async (type, name) => {
    const validTypes = ['model', 'controller', 'service', 'route', 'middleware', 'resource', 'res'];
    const normalizedType = type.toLowerCase();

    if (!validTypes.includes(normalizedType)) {
      console.error(chalk.red(`❌ Invalid type "${type}". Allowed types: ${validTypes.join(', ')}`));
      process.exit(1);
    }

    const { apiSrcDir, isTS } = resolveProjectPath();
    const ext = isTS ? 'ts' : 'js';

    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const camelName = name.charAt(0).toLowerCase() + name.slice(1);

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

    if (normalizedType === 'resource' || normalizedType === 'res') {
      console.log(chalk.cyan(`\n⚡ Scaffolding resource "${capitalizedName}"...\n`));
      createFile('models', `${capitalizedName}.${ext}`, generateModel(name, isTS));
      createFile('services', `${camelName}Service.${ext}`, generateService(name, isTS));
      createFile('controllers', `${camelName}Controller.${ext}`, generateController(name, isTS));
      createFile('routes', `${camelName}Routes.${ext}`, generateRoute(name, isTS));

      console.log(chalk.magenta(`\n💡 Don't forget to mount your new route in server.${ext}:`));
      console.log(chalk.gray(`   import ${camelName}Routes from './routes/${camelName}Routes.js';`));
      console.log(chalk.gray(`   app.use('/api/${camelName}s', ${camelName}Routes);\n`));
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
