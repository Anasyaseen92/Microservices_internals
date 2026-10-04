# Phase 2 — Service Skeletons

## Completed

- Added pnpm workspace configuration for `apps/*`, `services/*`, and `packages/*`.
- Added the Next.js/Tailwind starter frontend in `apps/web`.
- Added the API Gateway and seven backend service skeletons.
- Added Express app/server entry points, health routes, request-ID logging, and consistent basic error responses.
- Added service-local package files, TypeScript configs, `.env.example` files, and Dockerfiles.
- Added a database-free Docker Compose structure.
- Added the shared TypeScript package placeholder.

No databases, Prisma, authentication, business logic, inter-service HTTP calls, queues, or brokers were added.

## Install and run

```bash
corepack enable
pnpm install
pnpm typecheck
pnpm build
```

Run the frontend:

```bash
pnpm --filter web dev
```

Run any backend service independently:

```bash
pnpm --filter api-gateway dev
pnpm --filter auth-service dev
pnpm --filter product-service dev
pnpm --filter inventory-service dev
pnpm --filter cart-service dev
pnpm --filter order-service dev
pnpm --filter payment-service dev
pnpm --filter notification-service dev
```

## URLs

| Component | URL | Health URL |
|---|---|---|
| Web | http://localhost:3000 | — |
| API Gateway | http://localhost:4000 | http://localhost:4000/health |
| Auth | http://localhost:4001 | http://localhost:4001/health |
| Product | http://localhost:4002 | http://localhost:4002/health |
| Inventory | http://localhost:4003 | http://localhost:4003/health |
| Cart | http://localhost:4004 | http://localhost:4004/health |
| Order | http://localhost:4005 | http://localhost:4005/health |
| Payment | http://localhost:4006 | http://localhost:4006/health |
| Notification | http://localhost:4007 | http://localhost:4007/health |

## Remaining setup

Run `pnpm install` before type-checking or building. Docker Compose is intentionally only a skeleton at this phase and does not define databases or service dependencies yet.
