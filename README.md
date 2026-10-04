# Microservices E-Commerce Learning Project

This is a beginner-friendly e-commerce system for learning microservices internals with synchronous HTTP REST. The frontend talks only to the API Gateway. There are intentionally no Kafka, RabbitMQ, NATS, Redis, Kubernetes, cloud deployment, or message brokers.

## Architecture

```text
Next.js Web :3000 -> API Gateway :4000 -> Auth :4001 -------- auth-db :5433
                                      -> Product :4002 ----- product-db :5434
                                      -> Inventory :4003 --- in-memory
                                      -> Cart :4004 -------- in-memory
                                      -> Order :4005 ------- order-db :5435
                                      -> Payment :4006 ----- fake in-memory payment
                                      -> Notification :4007 - console log
```

| Service | Responsibility | Data ownership |
|---|---|---|
| API Gateway | Browser entry point and HTTP proxy | None |
| Auth Service | Registration, login, JWT, users | Auth PostgreSQL |
| Product Service | Catalog and admin product management | Product PostgreSQL |
| Inventory Service | Stock checks and reductions | In-memory |
| Cart Service | User carts | In-memory |
| Order Service | Checkout orchestration and order history | Order PostgreSQL |
| Payment Service | Fake payment processing | In-memory transaction map |
| Notification Service | Confirmation logging | None |

## Setup

Prerequisites: Node.js 22+, Docker Desktop, and pnpm through Corepack.

```bash
corepack enable
pnpm install
docker compose up --build -d
```

Compose starts databases, runs checked-in Prisma migrations and seeds through one-shot migration containers, waits for health checks, and starts all backend services, the gateway, and web app. It never runs a destructive database reset.

## Database commands

Compose performs migrations and seeds automatically. To run them manually:

```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5433/auth_db?schema=public"; pnpm --filter auth-service prisma:migrate:deploy; pnpm --filter auth-service prisma:seed
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5434/product_db?schema=public"; pnpm --filter product-service prisma:migrate:deploy; pnpm --filter product-service prisma:seed
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5435/order_db?schema=public"; pnpm --filter order-service prisma:migrate:deploy; pnpm --filter order-service prisma:seed
```

Demo credentials: `customer@example.com` / `DemoPass123!`, and `admin@example.com` / `DemoPass123!`.

## URLs

- Web: http://localhost:3000
- API Gateway: http://localhost:4000
- Gateway health: http://localhost:4000/health
- Swagger/OpenAPI JSON: `http://localhost:4000/docs`, and `/docs` on ports 4001–4007
- Services: `http://localhost:4001` through `http://localhost:4007`

The browser must use only `http://localhost:4000`. Set `apps/web/.env.example` to `NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:4000`.

## Checkout walkthrough

Login, browse products, open a detail page, add `product-001`, change quantity, and checkout with `4242424242424242`. Order Service reads the cart, trusts Product Service prices, checks and reduces Inventory, processes fake Payment, confirms the order, clears the cart, and asks Notification Service to log confirmation. Open My Orders and verify `CONFIRMED` plus the transaction ID. Use a card ending in `0000` to test `PAYMENT_FAILED`.

## Tests

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm -r test
docker compose up --build -d
docker compose ps
```

## Known limitations

- Cart and Inventory are in-memory and reset when containers restart.
- HTTP calls have timeouts but no distributed transaction.
- Payment success followed by inventory failure can require compensation.
- Notification is best-effort.
- Browser JWT storage uses local storage for learning.
- Admin protection still uses a temporary header placeholder.

## What I will learn next

- Replace selected HTTP calls with Kafka or RabbitMQ.
- Add persistent Cart and Inventory databases.
- Improve authentication storage and authorization.
- Add payment refunds and compensation handling.
- Add observability with OpenTelemetry and Jaeger.

