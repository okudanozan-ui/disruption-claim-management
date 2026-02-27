# Digital Disruption Claim Management Tool

An application for managing disruption claims with user authentication, role-based access control, task and project management, and disruption analysis. Built with Electron and React.

## Tech Stack

- **Electron 34** — Desktop shell with main/preload/renderer process model
- **React 18** — UI framework
- **Ant Design** + **Tailwind CSS 4** — Component library and utility styling
- **Sequelize 6** + **SQLite 3** — Local database (no external DB server needed)
- **electron-vite** — Build tooling
- **react-hook-form** — Form handling
- **react-toastify** — Notifications
- **papaparse** — CSV parsing

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)

No external database, environment variables, or additional services are required.

## Getting Started

```bash
npm install
npm run dev
```

The SQLite database is automatically created on first run in your platform's app data directory (e.g., `~/Library/Application Support` on macOS).

## Available Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start development (electron-vite dev)    |
| `npm run build`     | Build renderer, main, and preload        |
| `npm run start`     | Preview the built app                    |
| `npm run lint`      | Run ESLint with cache                    |
| `npm run format`    | Format all files with Prettier           |
| `npm run build:mac` | Build and package for macOS              |
| `npm run build:win` | Build and package for Windows            |
| `npm run build:linux` | Build and package for Linux            |

## Project Structure

```
src/
├── main/             Main process — Node.js, IPC handlers, DB access
├── preload/          Preload script — context bridge exposing window.api
├── renderer/src/     React app — UI, routing, components (Vite-bundled)
└── db/
    └── models/       Sequelize model definitions (User, etc.)
```

**Electron process model:**
- The **main process** handles all database operations and registers IPC handlers
- The **preload script** bridges specific APIs to the renderer via `window.api`
- The **renderer** is a standard React SPA that communicates through the IPC bridge

## Features

- **User authentication** — Registration and login with bcrypt password hashing
- **Role-based access control** — Five roles: Claim Manager, Legal and Contract Specialist, Planning Responsible, Cost Control Responsible, Site Responsible
- **Task management** — CRUD operations scoped per user
- **Project management** — Nested project routes with create/edit/delete
- **CSV analyzer** — Import and analyze CSV files via papaparse
- **Admin panel** — User management (roles, status, deletion) restricted to Claim Manager role

## Database

SQLite is used for local data persistence via Sequelize. The database file is stored in the platform-specific app data directory and auto-syncs on startup — no migrations or manual setup needed.

## Building for Distribution

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

These commands run `electron-vite build` followed by `electron-builder` for the target platform.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

