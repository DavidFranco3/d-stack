# 🚀 D-Stack Framework
### *The Full-Stack Monolith Framework by David Franco*

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/react-v19.2.8-blue.svg)](https://react.dev)
[![Vite Version](https://img.shields.io/badge/vite-v8.1.5-646cff.svg)](https://vitejs.dev)
[![Express Version](https://img.shields.io/badge/express-v5.0.0-000000.svg)](https://expressjs.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

**D-Stack** is a high-performance, professional-grade monolith framework designed for speed, scalability, and developer experience. Created by **David Franco**, it bridges the gap between a lightweight Express/React setup and heavy enterprise software architectures.

---

## 📋 Table of Contents
- [⚙️ System Requirements & Prerequisites](#️-system-requirements--prerequisites)
- [🛠️ Global Installation & Quick Start](#️-global-installation--quick-start)
- [🖥️ Complete CLI Command Reference](#️-complete-cli-command-reference)
- [📦 David Franco's Ecosystem (npm Libraries)](#-david-francos-ecosystem-npm-libraries)
  - [1. fluent-rest-client](#1-fluent-rest-client)
  - [2. react-apextable-pro](#2-react-apextable-pro)
  - [3. intl-currency-helper](#3-intl-currency-helper)
- [🏗️ Monolith Architecture & Folder Structure](#️-monolith-architecture--folder-structure)
- [🚀 Development & Production Build](#-development--production-build)
- [🌐 Deploying to GitHub Pages](#-deploying-to-github-pages)

---

## ⚙️ System Requirements & Prerequisites

Before installing and running **D-Stack**, ensure your local environment satisfies the following prerequisites:

| Requirement | Minimum Version | Command to Verify | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` | `node -v` | Node v18+, v20+ or v24+ LTS supported. |
| **MongoDB** | `>= 6.0` | `mongod` or `mongosh` | Local service listening on `127.0.0.1:27017` (database `dstack-db`). |
| **npm** | `>= 9.0.0` | `npm -v` | Standard Node package manager. |

---

## 🛠️ Global Installation & Quick Start

### 1. Install CLI Global Link
To make the `dstack` binary available globally in your command line:

```bash
cd /home/david/development/d-stack
npm link
```

> **Nota:** El CLI `dstack` no está publicado en npm. Debes usar `npm link` desde el repositorio clonado.

### 2. Initialize a Project
Scaffold a full-stack monolith application (Express API Backend + React 19 Frontend Web):

```bash
dstack init my-awesome-app
```
*(Follow the interactive prompts or pass flags like `-t ts` for TypeScript or `-t js` for JavaScript).*

### 3. Start Development Server
Run both the Backend API (port `4000`) and Vite Frontend (port `5173`) simultaneously:

```bash
cd my-awesome-app
npm run dev
```

---

## 🖥️ Complete CLI Command Reference

The `dstack` CLI automates project initialization, system diagnostics, and CRUD resource generator scaffolding.

### 1. `dstack init`
Initializes a new D-Stack project with pre-configured Express, Mongoose, Zod, Helmet, Vite 8, React 19, and Tailwind CSS.

```bash
# Interactive mode (prompts for language and installation)
dstack init my-app

# Non-interactive mode with TypeScript
dstack init my-app -t ts

# Non-interactive mode with JavaScript
dstack init my-app -t js

# Non-interactive mode without name (prompts only for name)
dstack init -t ts
```

---

### 2. `dstack generate resource` (Alias: `dstack g resource`)
Generates an entire end-to-end CRUD resource module in less than **1 second**. Automatically creates:
1. Mongoose Model schema (`api/src/models/Product.ts`)
2. Business Logic Service (`api/src/services/productService.ts`)
3. HTTP Controller (`api/src/controllers/productController.ts`)
4. Express Router with Zod validation (`api/src/routes/productRoutes.ts`)
5. React Web Page with `ApexTable` grid (`web/src/pages/ProductsPage.tsx`)

```bash
# Generate a complete CRUD module for 'Product'
dstack g resource Product

# Generate a complete CRUD module for 'Invoice'
dstack g resource Invoice
```

---

### 3. Individual Component Scaffolding
If you only need specific architectural layers instead of a full resource:

```bash
# Generate Mongoose Model only
dstack g model Customer

# Generate Business Logic Service only
dstack g service Customer

# Generate HTTP Controller only
dstack g controller Customer

# Generate Express Router only
dstack g route Customer

# Generate Custom Middleware only
dstack g middleware AuthGuard
```

---

### 4. `dstack doctor`
Runs a diagnostic check on your development workspace to verify Node.js version, npm version, MongoDB 27017 service connectivity, and project structure integrity.

```bash
dstack doctor
```

**Sample Output:**
```text
🩺 Running D-Stack System Diagnostic...

  ✔ Node.js Version: v20.11.0 (>= 18.0.0)
  ✔ npm Version: 10.2.4 (>= 9.0.0)
  ✔ Workspace: D-Stack App detected
  ✔ MongoDB: Service detected running on port 27017

✨ Diagnostic completed with 0 errors!
```

---

### 5. `dstack --version` & `dstack --help`
Displays the current CLI version or outputs the interactive help menu.

```bash
dstack --version    # Outputs version (e.g. 1.0.0)
dstack --help       # Shows command usage and available flags
```

---

## 📦 David Franco's Ecosystem (npm Libraries)

**D-Stack** comes pre-integrated with three high-performance npm packages authored by **David Franco**. You are strongly encouraged to adopt these packages in your other Node.js, Express, and React projects for cleaner code, type safety, and superior UI UX!

```
 ┌─────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────┐
 │   fluent-rest-client    │   │   react-apextable-pro   │   │   intl-currency-helper  │
 │  Fluent REST API Client │   │  Enterprise Data Grid   │   │ Currency Formatter      │
 └─────────────────────────┘   └─────────────────────────┘   └─────────────────────────┘
```

---

### 1. `fluent-rest-client`
> **Fluent, object-oriented HTTP client for Node.js & React with builder pattern, automatic JWT authentication, and safe error handling.**

[![npm version](https://img.shields.io/npm/v/fluent-rest-client.svg)](https://www.npmjs.com/package/fluent-rest-client)

#### Why Use It in Your Projects?
Tired of writing repetitive `axios` or `fetch` wrappers with `try/catch` boilerplate? `fluent-rest-client` provides an intuitive, chainable syntax that handles headers, base URLs, and response formatting effortlessly.

#### Installation
```bash
npm install fluent-rest-client
```

#### Code Example
```typescript
import { createClient } from 'fluent-rest-client';

const api = createClient({ baseURL: 'http://localhost:4000/api' });

// Chainable GET request
const response = await api.resource('resources').safe().get();

if (response.ok) {
  console.log('Fetched data:', response.data);
} else {
  console.error('Error status:', response.status);
}

// Chainable POST request with body
await api.resource('products').safe().post({ name: 'Laptop', price: 999.99 });
```

---

### 2. `react-apextable-pro`
> **Enterprise-grade React data table library supporting React 19 natively, with sticky columns, LocalStorage state persistence, search filtering, and CSV/PDF exports.**

[![npm version](https://img.shields.io/npm/v/react-apextable-pro.svg)](https://www.npmjs.com/package/react-apextable-pro)

#### Why Use It in Your Projects?
Building customizable, persistent data tables for admin dashboards can take weeks. `react-apextable-pro` provides fixed columns (up to 3 sticky columns), instant search, custom cell rendering, dark mode compatibility, and zero-config export buttons (CSV & PDF).

#### Installation
```bash
npm install react-apextable-pro
```

#### Code Example
```tsx
import { ApexTable, ApexTableColumn } from 'react-apextable-pro';

interface Product {
  code: string;
  name: string;
  price: number;
}

const columns: ApexTableColumn<Product>[] = [
  { name: 'Code', selector: row => row.code, sortable: true },
  { name: 'Name', selector: row => row.name, sortable: true },
  { name: 'Price', selector: row => row.price, sortable: true },
];

export default function MyTableComponent({ items }: { items: Product[] }) {
  return (
    <ApexTable
      datos={items}
      columnas={columns}
      storagePrefix="my_app_table_"
      pagination
    />
  );
}
```

---

### 3. `intl-currency-helper`
> **Ultra-lightweight, zero-dependency international currency formatter for Node.js and React applications based on native `Intl.NumberFormat`.**

[![npm version](https://img.shields.io/npm/v/intl-currency-helper.svg)](https://www.npmjs.com/package/intl-currency-helper)

#### Why Use It in Your Projects?
Formatting multi-currency values (`USD`, `MXN`, `EUR`, `GBP`) correctly across browsers and locales can be tricky. `intl-currency-helper` provides a clean, 1-line helper that formats any numeric input accurately with currency symbols, decimal precision, and fallback safety.

#### Installation
```bash
npm install intl-currency-helper
```

#### Code Example
```typescript
import { formatCurrency } from 'intl-currency-helper';

// USD Format -> "$1,250.50"
console.log(formatCurrency(1250.50, { currency: 'USD' }));

// MXN Format -> "$24,900.00"
console.log(formatCurrency(24900.00, { currency: 'MXN' }));

// EUR Format -> "€499.00"
console.log(formatCurrency(499.00, { currency: 'EUR', locale: 'de-DE' }));
```

---

## 🏗️ Monolith Architecture & Folder Structure

**D-Stack** enforces a clean, layered architecture separating HTTP Controllers, Business Logic Services, Mongoose Models, and Express Routes:

```text
my-dstack-app/
├── api/                   # Backend Express API Server
│   └── src/
│       ├── config/        # MongoDB connection & Seeders
│       ├── controllers/   # HTTP Request/Response Handlers
│       ├── services/      # Business Logic & Database Queries
│       ├── routes/        # Express Routes & Zod Validation Schemas
│       ├── models/        # Mongoose Models (User, Resource, etc.)
│       ├── middleware/    # Auth JWT, Zod Validator, Helmet & Logger
│       └── server.ts      # Express Server Entry Point
├── web/                   # Frontend Vite + React 19 SPA
│   └── src/
│       ├── api/           # fluent-rest-client instance
│       ├── components/    # ApexTable, AppLayout, Navbar
│       ├── pages/         # DashboardPage, ResourcesPage, UsersPage
│       ├── index.css      # Design System Tokens & Tailwind CSS
│       └── main.tsx       # React App Mounting Entry Point
└── shared/                # Shared TypeScript Interfaces & DTOs
```

---

## 🚀 Development & Production Build

### Running Locally
To start the live development environment (Express API on port `4000` + Vite Web on port `5173`):

```bash
npm run dev
```

### Production Build
To test the production build for both backend and frontend:

```bash
npm run build
```

---

## 🌐 Deploying to GitHub Pages

To publish **ONLY** the documentation web site (`site/` folder with `index.html`, `styles.css`, and `app.js`) to GitHub Pages:

```bash
cd /home/david/development/d-stack

# 1. Commit changes to master branch
git add .
git commit -m "docs: publish documentation site"
git push origin master

# 2. Deploy ONLY the site/ directory to gh-pages branch
git subtree push --prefix site origin gh-pages
```

Your live documentation site will be accessible at:  
👉 **`https://DavidFranco3.github.io/d-stack/`**

---

## 👤 Author & Maintainer

**David Franco**  
*Full-Stack Engineer & Open-Source Maintainer*  
- **GitHub**: [@DavidFranco3](https://github.com/DavidFranco3)  
- **npm Packages**: [`fluent-rest-client`](https://www.npmjs.com/package/fluent-rest-client) | [`react-apextable-pro`](https://www.npmjs.com/package/react-apextable-pro) | [`intl-currency-helper`](https://www.npmjs.com/package/intl-currency-helper)

---

© 2026 David Franco. Licensed under the [ISC License](LICENSE).
