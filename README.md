# Delphinium

Delphinium is a full-stack web application. This project is structured as a monorepo using `pnpm` workspaces.

## Project Structure

- `apps/backend/`: Express.js API backend with Prisma ORM and CQRS architecture using Inversify.
- `apps/frontend/`: React single-page application built with Vite and TailwindCSS.
- `packages/*/`: Shared domain logic, and commands used across the workspace.

## Prerequisites

To build and run this project, you need the following installed on your system:

- **Node.js** (v25.9.0 or later recommended)
- **pnpm** (v10.33.0 or later)
- **Docker & Docker Compose** (for running the PostgreSQL database)

Node.js and pnpm can be set easily using mise

## Quick Start

### 1. Install Dependencies

From the workspace root, run:

```bash
pnpm install
```

### 2. Set Up the Database

The backend relies on a PostgreSQL database. Start the database using Docker Compose:

```bash
cd apps/backend
docker-compose up -d
```

Next, configure your environment variables. Ensure that `apps/backend/.env` is properly configured with your `DATABASE_URL` (it may already be set up for the docker-compose instance).

Push the Prisma schema to the database and generate the Prisma Client:

```bash
cd apps/backend
pnpm db:push
pnpm db:generate
```

_(Alternatively, from the root: `pnpm --filter backend db:push && pnpm --filter backend db:generate`)_

### 3. Run the Development Servers

With Moon installed globally or using `npx`, you can easily spin up both the backend and frontend simultaneously with a single command:

```bash
pnpm exec moon run :dev
```

This will run `backend:dev` and `frontend:dev` concurrently, preserving their console output.

Alternatively, you can run them individually:
**Start the Backend:** `pnpm exec moon run backend:dev` or `pnpm --filter backend dev` (runs on `http://localhost:3000`)
**Start the Frontend:** `pnpm exec moon run frontend:dev` or `pnpm --filter frontend dev` (runs on `http://localhost:5173`)

## Running Tests

To run the unit tests across the workspace (e.g., in the backend):

```bash
pnpm --filter backend test
```
