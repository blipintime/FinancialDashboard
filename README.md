# MyRailway

A minimal full-stack app that lists users from PostgreSQL.

- **Backend:** Node.js + Express + TypeScript, `pg` (node-postgres)
- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ running locally (or reachable via a connection string)

## 1. Initialize the database

```bash
createdb myrailway
psql myrailway -f db/init.sql
```

This creates a `users` table and seeds it with 5 sample rows. The script is idempotent — re-running it won't duplicate data.

## 2. Run the backend

```bash
cd server
cp .env.example .env        # then edit DATABASE_URL if needed
npm install
npm run dev
```

The API will be available at `http://localhost:4000/api/users`.

## 3. Run the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api/*` to the backend on port 4000, so the frontend can fetch users without any CORS hassle.

## Project layout

```
.
├── db/init.sql          # schema + seed data
├── server/              # Express API
└── client/              # Vite + React + Tailwind
```
