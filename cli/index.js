#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import shell from 'shelljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('dstack')
  .description('D-Stack: Full-stack monolith generator by David Franco (Express + React)')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new project')
  .argument('[name]', 'Project name')
  .action(async (name) => {
    const questions = [];

    if (!name) {
      questions.push({
        type: 'input',
        name: 'projectName',
        message: 'What is your project named?',
        default: 'my-dstack-app',
      });
    }

    questions.push({
      type: 'list',
      name: 'language',
      message: 'Select language:',
      choices: ['JavaScript', 'TypeScript'],
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

    console.log(chalk.cyan(`\n🚀 Initializing ${projectName} in ${answers.language}...\n`));

    try {
      if (fs.existsSync(targetPath)) {
        console.error(chalk.red(`Error: Directory ${projectName} already exists.`));
        process.exit(1);
      }

      // Copy template
      await fs.copy(templatePath, targetPath);

      // Rename template placeholders if any (e.g., in package.json)
      const packageJsonPath = path.join(targetPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkg = await fs.readJson(packageJsonPath);
        pkg.name = projectName;
        await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
      }

      // Install dependencies if requested
      if (answers.installDeps) {
        console.log(chalk.cyan(`\n📦 Installing dependencies... (this might take a minute)\n`));
        shell.cd(targetPath);
        if (shell.exec('npm run install-all').code !== 0) {
          console.error(chalk.red('\nError installing dependencies. You may need to run "npm run install-all" manually.'));
        } else {
          console.log(chalk.green('\n✅ Dependencies installed successfully!'));
        }
      }

      console.log(chalk.green(`\n✅ Project ${projectName} created successfully!`));
      console.log(chalk.yellow(`\nNext steps:`));
      console.log(chalk.white(`  cd ${projectName}`));
      
      if (!answers.installDeps) {
        console.log(chalk.white(`  npm run install-all`));
      }
      
      console.log(chalk.white(`  npm run dev\n`));

    } catch (err) {
      console.error(chalk.red('Error creating project:'), err);
    }
  });

program
  .command('generate')
  .alias('g')
  .description('Generate a new component (model, controller, service)')
  .argument('<type>', 'Type of component to generate (model, controller, service)')
  .argument('<name>', 'Name of the component')
  .action(async (type, name) => {
    const isTS = fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
    const ext = isTS ? 'ts' : 'js';
    const folder = type === 'model' ? 'models' : type === 'controller' ? 'controllers' : 'services';
    
    // Capitalize first letter for Class/Model names
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    const targetDir = path.join(process.cwd(), 'src', folder);
    const targetFile = path.join(targetDir, `${capitalizedName}.${ext}`);

    if (fs.existsSync(targetFile)) {
      console.error(chalk.red(`Error: ${type} ${capitalizedName} already exists.`));
      process.exit(1);
    }

    if (!fs.existsSync(targetDir)) {
      fs.ensureDirSync(targetDir);
    }

    let content = '';
    if (type === 'model') {
      content = isTS 
        ? `import mongoose, { Schema, Document } from 'mongoose';\n\nexport interface I${capitalizedName} extends Document {\n  name: string;\n}\n\nconst ${capitalizedName}Schema: Schema = new Schema({\n  name: { type: String, required: true },\n}, { timestamps: true });\n\nexport const ${capitalizedName} = mongoose.model<I${capitalizedName}>('${capitalizedName}', ${capitalizedName}Schema);`
        : `const mongoose = require('mongoose');\n\nconst ${capitalizedName}Schema = new mongoose.Schema({\n  name: { type: String, required: true },\n}, { timestamps: true });\n\nmodule.exports = mongoose.model('${capitalizedName}', ${capitalizedName}Schema);`;
    } else if (type === 'controller') {
      content = isTS
        ? `import { Request, Response, NextFunction } from 'express';\n\nexport class ${capitalizedName}Controller {\n  static async getAll(req: Request, res: Response, next: NextFunction) {\n    try {\n      res.json({ message: 'Get all ${name}s' });\n    } catch (err) {\n      next(err);\n    }\n  }\n}`
        : `class ${capitalizedName}Controller {\n  static async getAll(req, res, next) {\n    try {\n      res.json({ message: 'Get all ${name}s' });\n    } catch (err) {\n      next(err);\n    }\n  }\n}\n\nmodule.exports = ${capitalizedName}Controller;`;
    }

    fs.writeFileSync(targetFile, content);
    console.log(chalk.green(`\n✅ Generated ${type}: src/${folder}/${capitalizedName}.${ext}`));
  });

program.parse(process.argv);
