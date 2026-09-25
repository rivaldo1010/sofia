# Sofía — Tienda Virtual

E-commerce de moda y accesorios para hombre y mujer.

## Stack
- Frontend: React 18 + Vite + TypeScript + Tailwind + Zustand + React Query
- Backend: Node + Express + TypeScript + Prisma
- DB: PostgreSQL
- Auth: JWT + bcrypt

## Requisitos
- Node 20+
- pnpm 9+
- Docker Desktop

## Instalación
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm admin:create
pnpm dev

- Web: http://localhost:5173
- API: http://localhost:4000/api