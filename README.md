# 🚀 D-Stack Framework
### *The Full-Stack Monolith by David Franco*

**D-Stack** is a powerful, professional-grade monolith framework designed for speed, scalability, and ease of use. It bridges the gap between a simple Express/React template and a heavy enterprise framework.

---

## ✨ Features

- **🎯 Professional Layered Architecture**: Clean separation of Routes, Controllers, and Services.
- **🛡️ Type-Safe by Default**: Built with TypeScript from the ground up (also supports JavaScript).
- **✅ Automatic Validation**: Integrated **Zod** middleware for robust request schema validation.
- **🔐 Security First**: Pre-configured with **Helmet** and **Rate Limiting** to protect your API.
- **🔧 Powerful CLI**: Generate models, controllers, and services in seconds with the `dstack` command.
- **🗑️ Soft Delete**: Integrated Mongoose plugin to keep your data safe.
- **📝 Structured Logging**: Built with Winston and Morgan for professional observability.

---

## 🛠️ Quick Start

### 1. Installation
To use the `dstack` command globally on your machine:
```bash
# Inside the dstack root folder
npm link
```

### 2. Initialize a Project
Create a new full-stack application in seconds:
```bash
dstack init my-awesome-app
```

### 3. Generate Components
Speed up your development with automated scaffolding:
```bash
# Generate a new Mongoose model
dstack g model Product

# Generate a new Controller
dstack g controller Product
```

---

## 📂 Project Structure

```text
src/
├── controllers/    # Handle HTTP logic (req/res)
├── services/       # Pure business logic and DB calls
├── routes/         # API Endpoint definitions
├── models/         # Mongoose schemas and TS interfaces
├── middleware/     # Auth, Validation, and Error Handling
└── server.ts       # Application entry point
```

---

## 🏗️ Requirements

- **Node.js**: v18+ 
- **MongoDB**: A local or remote instance (MongoDB Atlas)

---

## 👤 Author

**David Franco**
*Professional Full-Stack Developer*

---

> [!TIP]
> **D-Stack** uses a centralized error handler. You don't need messy `try/catch` blocks in your controllers; just pass errors to `next(err)` and the framework will respond with a beautiful JSON error.

---
© 2026 David Franco. All rights reserved.
