# 🚀 D-Stack Framework
### *The Full-Stack Monolith Framework by David Franco*

**D-Stack** is a powerful, professional-grade monolith framework designed for speed, scalability, and developer experience. It bridges the gap between a simple Express/React template and a heavy enterprise framework.

---

## ✨ Key Features

- **🎯 Professional Layered Architecture**: Clean separation of Routes, Controllers, Services, and Models.
- **🛡️ Type-Safe & Polyglot**: Built with TypeScript from the ground up, with full JavaScript parity.
- **✅ Automatic Validation**: Integrated **Zod** middleware for request schema validation.
- **🌐 Fluent REST Client**: Pre-integrated with [`fluent-rest-client`](https://www.npmjs.com/package/fluent-rest-client) for clean, type-safe API requests with automatic auth token management.
- **🔐 Security First**: Pre-configured with **Helmet** and **Rate Limiting** out of the box.
- **🔧 Powerful Scaffolding CLI**: Generate Models, Controllers, Services, Routes, Middleware, or complete **Resources** in seconds.
- **🩺 System Diagnostics**: Built-in `dstack doctor` to verify environment, Node version, and MongoDB connection.
- **🗑️ Soft Delete**: Integrated Mongoose plugin to keep your data safe.
- **📝 Structured Logging**: Built with Winston and Morgan for production observability.

---

## 🛠️ Quick Start

### 1. Global CLI Installation
Link the `dstack` binary globally on your machine:
```bash
# Inside the d-stack framework root folder
npm link
```

### 2. Initialize a Project
Create a new full-stack application (monolith API + React Web):
```bash
dstack init my-awesome-app
```
*(Follow the interactive prompts to choose between TypeScript and JavaScript).*

### 3. Run System Diagnostic
Verify that Node.js and MongoDB are ready:
```bash
dstack doctor
```

### 4. Official Landing Page & Docs
View the interactive website and documentation:
```bash
npm run site
```

---

## ⚡ Scaffolding Commands (`dstack generate` / `dstack g`)

Speed up your development with smart component scaffolding:

```bash
# 🚀 Generate a full Resource (Model, Service, Controller, and Route all in one command!)
dstack g resource Product

# 📦 Generate individual components
dstack g model Product
dstack g service Product
dstack g controller Product
dstack g route Product
dstack g middleware Auth
```

---

## 📂 Monolith Architecture

```text
my-dstack-app/
├── api/                   # Backend Express Server
│   └── src/
│       ├── config/        # Database & Environment configuration
│       ├── controllers/   # HTTP Layer (Req/Res handling)
│       ├── services/      # Business Logic & Database operations
│       ├── routes/        # Express Route definitions & Zod validation
│       ├── models/        # Mongoose Models & Schemas
│       ├── middleware/    # Auth, Validation, Logger & Error Handlers
│       └── server.ts      # Application entry point
└── web/                   # Frontend React + Vite SPA
```

---

## 🏗️ System Requirements

- **Node.js**: v18+ 
- **MongoDB**: Local MongoDB instance (`127.0.0.1:27017`) or remote MongoDB Atlas connection string.

---

## 👤 Author

**David Franco**  
*Professional Full-Stack Developer*

---

> [!TIP]
> **D-Stack** features centralized error handling. You don't need messy `try/catch` blocks inside controllers; simply pass errors to `next(err)` and D-Stack will respond with clean, standardized JSON errors.

---

© 2026 David Franco. All rights reserved.
