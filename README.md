# ⚡ D-Stack Framework

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Version" />
  <img src="https://img.shields.io/badge/React-v19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Version" />
  <img src="https://img.shields.io/badge/Vite-v8.1.5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Version" />
  <img src="https://img.shields.io/badge/Express-v4.22.1-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express Version" />
  <img src="https://img.shields.io/badge/MongoDB-v6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Version" />
  <img src="https://img.shields.io/badge/OpenAPI-3.0-85EA2D?style=for-the-badge&logo=openapiinitiative&logoColor=black" alt="OpenAPI Version" />
  <img src="https://img.shields.io/badge/License-ISC-ff69b4?style=for-the-badge" alt="License" />
</p>

> **Full-stack monolith framework — Express API + React 19 SPA + MongoDB.**
> CLI-driven scaffolding with automatic route injection, CRUD & Auth generation, Zod validation, OpenAPI docs, SweetAlert2 notifications, and an opinionated layered architecture.

---

## 📋 Requirements

| Tool | Minimum | Notes |
| :--- | :--- | :--- |
| **Node.js** 🟢 | `>= 18` | 18+, 20+ or 24+ LTS |
| **npm** 📦 | `>= 9` | |
| **MongoDB** 🍃 | `>= 6` | Local service at `127.0.0.1:27017` (database `dstack-db`) |

---

## 🚀 Quick Start

```bash
# 1. Install CLI globally
npm install -g @davidfranco3/dstack

# 2. Scaffold a new project (TypeScript) and install dependencies
#    (-i / --install installs dependencies non-interactively)
dstack init my-app -t ts -i

# 3. Start development (API :4000 + Vite :5173)
cd my-app
npm run dev
```

---

## 🛠️ CLI Commands

| Command | Description |
| :--- | :--- |
| `dstack init [name]` | Scaffold a full-stack project (`-t ts` / `-t js`) |
| `dstack g resource <Name>` | Generate CRUD module, auto-inject routes, and create React page with Modals, Toasts & 3-dots Dropdown |
| `dstack g auth` | Scaffold complete Auth module & UI (`RegisterPage`, `/register` route, `/api/auth/register \| login \| me \| logout`) |
| `dstack remove resource <Name>` | Delete resource files and un-inject routes from `server.ts` & `App.tsx` |
| `dstack g model\|service\|controller\|route\|middleware <Name>` | Scaffold a single layer |
| `dstack doctor` | Check Node, npm, MongoDB, and project structure |
| `dstack --version\|--help` | Version info and help |

---

### 📦 `dstack init`

Creates the project structure with Express + Mongoose + Zod + Helmet + OpenAPI Docs (backend) and Vite + React 19 + Tailwind CSS + SweetAlert2 (frontend).

```bash
dstack init my-app             # interactive mode
dstack init my-app -t ts       # TypeScript, non-interactive (no dependency install)
dstack init my-app -t ts -i    # TypeScript, non-interactive + install dependencies
dstack init my-app -t js       # JavaScript, non-interactive
```

---

### ⚡ `dstack generate resource` (alias: `dstack g resource`)

Generates a complete CRUD module for a given entity name. Creates all layers, auto-registers routes in `server.ts` & `App.tsx`, and generates an interactive React page with `ApexTable`, Modals, SweetAlert2 toasts, and a 3-dots (`MoreVertical`) dropdown menu.

```bash
dstack g resource Product
dstack g resource Invoice
```

**📁 What it creates & registers:**

```text
api/src/models/Product.ts           # 🍃 Mongoose model
api/src/services/productService.ts    # ⚙️ Business logic with pagination & search
api/src/controllers/productController.ts # 🎮 HTTP handlers
api/src/routes/productRoutes.ts      # 🛣️ Express routes + Zod validation
web/src/pages/ProductPage.tsx        # 💻 React page with Modals, Swal & 3-dots Dropdown
```

**✨ Automatic Registration:**
* Auto-registers route in `api/src/server.ts`: `app.use('/api/products', productRoutes);`
* Auto-registers page in `web/src/App.tsx`: `<Route path="/products" element={<ProductPage />} />`

---

### 🔑 `dstack generate auth` (alias: `dstack g auth`)

Scaffolds the full User Authentication & Account Registration flow:

```bash
dstack g auth
```

Creates `RegisterPage.tsx`, links `/register` in `App.tsx`, and wires up the backend auth endpoints:

| Endpoint | Description |
| :--- | :--- |
| `POST /api/auth/register` | Create an account (sets an httpOnly session cookie) |
| `POST /api/auth/login` | Log in with email + password (sets an httpOnly session cookie) |
| `GET /api/auth/me` | Restore the current session user (used on app reload) |
| `POST /api/auth/logout` | Clear the session cookie |

> 🔒 The JWT lives in an **httpOnly cookie** — it is never exposed to JavaScript, protecting the token from XSS. The seed creates dev users with the default credentials `admin@dstack.com` / `12345678` (hardcoded in `api/src/config/seed.ts` — change them or hash them to your liking before going to production).

---

### 🗑️ `dstack remove resource <Name>` (alias: `dstack rm resource <Name>`)

Safely deletes all generated files for a resource and **un-injects** its routes from `server.ts` and `App.tsx`:

```bash
dstack remove resource Product
```

---

### 📄 Interactive OpenAPI / Swagger API Docs (`/api/docs`)

Every D-Stack project comes with built-in interactive Swagger UI documentation out-of-the-box:

* **Interactive UI:** `http://localhost:4000/api/docs`
* **JSON Spec:** `http://localhost:4000/api/docs/json`

> 📝 The OpenAPI spec at `/api/docs/json` is a static overview of the core endpoints; generated resource routes are registered in `api/src/server.ts` and are not listed in the spec automatically.

---

### 🩺 `dstack doctor`

Runs diagnostics on the current workspace.

```text
dstack doctor

  ✔ Node.js Version: v20.11.0 (>= 18.0.0)
  ✔ npm Version: 10.2.4 (>= 9.0.0)
  ✔ Workspace: D-Stack App detected
  ✔ MongoDB: Service detected running on port 27017
```

---

## 🏗️ Architecture

```text
my-app/
├── ⚙️ api/                   # Express backend
│   └── src/
│       ├── config/        # MongoDB connection & seeders
│       ├── controllers/   # Request handlers (Paginated)
│       ├── services/      # Business logic
│       ├── routes/        # Express routers + Zod schemas
│       ├── models/        # Mongoose schemas
│       ├── middleware/    # JWT auth, Zod error handler, logging
│       ├── plugins/       # Mongoose plugins (soft-delete)
│       └── server.ts      # Entry point with OpenAPI /api/docs
├── 🌐 web/                   # React SPA
│   └── src/
│       ├── api/           # fluent-rest-client instance
│       ├── components/    # Dropdown (fixed z-99999), AppLayout, etc.
│       ├── pages/         # Route pages (UsersPage, ProductPage, etc.)
│       └── App.tsx        # Root component with router
└── 📦 shared/                # Shared TypeScript interfaces
```

> **🔄 Request flow:** Route → Zod validation middleware → Controller → Service → Model (Mongoose)

---

## 📚 Included Libraries

The project bundles npm packages for full-stack monolith development:

| Package | Purpose |
| :--- | :--- |
| 🔗 [`fluent-rest-client`](https://www.npmjs.com/package/fluent-rest-client) | Chainable HTTP client with JWT support |
| 📊 [`react-apextable-pro`](https://www.npmjs.com/package/react-apextable-pro) | Data table with sticky columns, search, CSV/PDF export |
| 🍬 [`sweetalert2`](https://sweetalert2.github.io/) | Dark-themed Toast notifications & confirm dialogs |
| 💱 [`intl-currency-helper`](https://www.npmjs.com/package/intl-currency-helper) | Multi-currency formatter based on `Intl.NumberFormat` |

---

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` 🚀 | Start API + Web concurrently (development) |
| `npm run build` 🏗️ | Build Web (Vite) + API (tsc) |
| `npm run start` ▶️ | Start production API server |
| `npm test` 🧪 | Run CLI test suite (`tests/cli.test.js`) |

---

## 👤 Author

**David Franco** — [@DavidFranco3](https://github.com/DavidFranco3)

Licensed under [ISC](LICENSE).
