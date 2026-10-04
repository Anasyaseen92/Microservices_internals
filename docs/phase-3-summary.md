# Phase 3 — PostgreSQL, Prisma, Migrations, and Seeds

## Database ownership

Only these services have PostgreSQL and Prisma:

| Service | Database | Host port | Owned data |
|---|---|---:|---|
| Auth Service | `auth_db` | 5433 | Users and roles |
| Product Service | `product_db` | 5434 | Product catalog |
| Order Service | `order_db` | 5435 | Orders and order items |

Inventory, Cart, Payment, Notification, and API Gateway still have no database. Each Prisma client is generated into its owning service's `prisma/generated/client` directory. No service reads another service's database.

## Start databases

```bash
docker compose up -d auth-db product-db order-db
```

The default local credentials are `postgres` / `postgres`.

## Migrations

Run from the repository root in PowerShell:

```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5433/auth_db?schema=public"; pnpm --filter auth-service prisma:migrate -- --name init
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5434/product_db?schema=public"; pnpm --filter product-service prisma:migrate -- --name init
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5435/order_db?schema=public"; pnpm --filter order-service prisma:migrate -- --name init
```

Each service also has `prisma:generate` for regenerating its local client.

## Seed data

```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5433/auth_db?schema=public"; pnpm --filter auth-service prisma:seed
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5434/product_db?schema=public"; pnpm --filter product-service prisma:seed
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5435/order_db?schema=public"; pnpm --filter order-service prisma:seed
```

The auth seed creates two users, the product seed creates 12 products, and the order seed intentionally creates no orders because order APIs do not exist yet.

Demo credentials for both seeded users: `DemoPass123!`

- Customer: `customer@example.com`
- Admin: `admin@example.com`

## Prisma Studio

```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5433/auth_db?schema=public"; pnpm --filter auth-service prisma:studio
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5434/product_db?schema=public"; pnpm --filter product-service prisma:studio
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5435/order_db?schema=public"; pnpm --filter order-service prisma:studio
```

Prisma Studio normally opens on port 5555; use a different port when running multiple Studio processes, for example `prisma studio --port 5556`.

## Validation

- `pnpm install`: passed.
- Prisma client generation: passed for all three services.
- Migrations: passed for all three databases.
- Seeds: passed for all three services.
- Root typecheck/build should be run after the final generated-client changes; Docker database startup requires Docker Desktop to remain running.
