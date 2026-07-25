# D-Stack Framework

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/react-v19.2.8-blue.svg)](https://react.dev)
[![Vite Version](https://img.shields.io/badge/vite-v5.4.14-646cff.svg)](https://vitejs.dev)
[![Express Version](https://img.shields.io/badge/express-v4.21.2-000000.svg)](https://expressjs.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

Full-stack monolith framework — Express API + React 19 SPA + MongoDB. CLI-driven scaffolding with CRUD generation, Zod validation, JWT auth, and an opinionated layered architecture.

---

## Requirements

| Tool     | Minimum  | Notes                                  |
|----------|----------|----------------------------------------|
| Node.js  | >= 18    | 18+, 20+ or 24+ LTS                    |
| npm      | >= 9     |                                        |
| MongoDB  | >= 6     | Local service at `127.0.0.1:27017` (database `dstack-db`) |

---

## Quick Start

```bash
# 1. Install CLI (from cloned repo — not published on npm)
git clone <repo-url>
cd d-stack
npm link

# 2. Scaffold a project
dstack init my-app -t ts

# 3. Start development (API :4000 + Vite :5173)
cd my-app
npm run dev
```

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `dstack init [name]` | Scaffold a full-stack project (`-t ts` / `-t js`) |
| `dstack g resource <Name>` | Generate model, service, controller, route & frontend page |
| `dstack g model\|service\|controller\|route\|middleware <Name>` | Scaffold a single layer |
| `dstack doctor` | Check Node, npm, MongoDB, and project structure |
| `dstack --version\|--help` | Version info and help |

### `dstack init`

Creates the project structure with Express + Mongoose + Zod + Helmet (backend) and Vite + React 19 + Tailwind CSS (frontend).

```bash
dstack init my-app             # interactive
dstack init my-app -t ts       # TypeScript, non-interactive
dstack init my-app -t js       # JavaScript, non-interactive
```

### `dstack generate resource` (alias: `dstack g resource`)

Generates a complete CRUD module for a given entity name. Creates all layers plus a React page with `ApexTable`.

```bash
dstack g resource Product
dstack g resource Invoice
```

**What it creates:**

```
api/src/models/Product.ts         # Mongoose model
api/src/services/productService.ts  # Business logic
api/src/controllers/productController.ts  # HTTP handlers
api/src/routes/productRoutes.ts    # Express routes + Zod validation
web/src/pages/ProductPage.tsx      # React page with ApexTable
```

### Individual scaffolding

```bash
dstack g model Customer
dstack g service Customer
dstack g controller Customer
dstack g route Customer
dstack g middleware AuthGuard
```

### `dstack doctor`

Runs diagnostics on the current workspace.

```
dstack doctor

  ✔ Node.js Version: v20.11.0 (>= 18.0.0)
  ✔ npm Version: 10.2.4 (>= 9.0.0)
  ✔ Workspace: D-Stack App detected
  ✔ MongoDB: Service detected running on port 27017
```

---

## Architecture

```
my-app/
├── api/                   # Express backend
│   └── src/
│       ├── config/        # MongoDB connection & seeders
│       ├── controllers/   # Request handlers
│       ├── services/      # Business logic
│       ├── routes/        # Express routers + Zod schemas
│       ├── models/        # Mongoose schemas
│       ├── middleware/    # JWT auth, validation, logging, error handler
│       ├── plugins/       # Mongoose plugins (soft-delete)
│       └── server.ts      # Entry point
├── web/                   # React SPA
│   └── src/
│       ├── api/           # fluent-rest-client instance
│       ├── components/    # Shared components (AppLayout, etc.)
│       ├── pages/         # Route pages
│       └── App.tsx        # Root component with router
└── shared/                # Shared TypeScript interfaces
```

**Request flow:** Route → Zod validation middleware → Controller → Service → Model (Mongoose)

---

## Included Libraries

The project bundles three packages published on npm:

| Package | Purpose |
|---------|---------|
| [`fluent-rest-client`](https://www.npmjs.com/package/fluent-rest-client) | Chainable HTTP client with JWT support |
| [`react-apextable-pro`](https://www.npmjs.com/package/react-apextable-pro) | Data table with sticky columns, search, CSV/PDF export |
| [`intl-currency-helper`](https://www.npmjs.com/package/intl-currency-helper) | Multi-currency formatter based on `Intl.NumberFormat` |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API + Web concurrently (development) |
| `npm run build` | Build Web (Vite) + API (tsc) |
| `npm run start` | Start production API server |
| `npm test` | Run API tests (vitest) |

---

## Author

**David Franco** — [@DavidFranco3](https://github.com/DavidFranco3)

Licensed under [ISC](LICENSE).
