# Phase 1 — Repository Structure and Port Plan

This project is a learning-focused e-commerce system built from independently owned services. All service-to-service communication will use synchronous HTTP REST requests only. No message broker, cache, or orchestration platform is included in the initial implementation.

## Proposed repository structure

```text
microservices-ecommerce/
├── apps/
│   └── web/                         # Next.js + TypeScript + Tailwind frontend
├── services/
│   ├── api-gateway/                 # Public HTTP entry point and JWT forwarding
│   ├── auth-service/                # Users, credentials, JWT issuance; PostgreSQL + Prisma
│   ├── product-service/             # Product catalog; PostgreSQL + Prisma
│   ├── inventory-service/           # Stock records; in-memory for the first version
│   ├── cart-service/                # User carts; in-memory for the first version
│   ├── order-service/               # Orders and checkout orchestration; PostgreSQL + Prisma
│   ├── payment-service/             # Synchronous fake payment provider
│   └── notification-service/        # Synchronous console-log notifications
├── packages/
│   └── shared/                      # Small shared TypeScript types/utilities only
├── prisma/
│   └── README.md                    # Notes about service-local Prisma ownership
├── docs/
│   ├── phase-1-plan.md
│   └── architecture.md              # Added during the documentation phase
├── docker-compose.yml               # Added during infrastructure phase
├── package.json                     # Workspace scripts
├── tsconfig.base.json
├── README.md
└── .env.example
```

Each backend service will additionally contain its own `src/` tree, Express app entry point, routes, controllers, service layer, validation schemas, request-ID middleware, error middleware, Swagger/OpenAPI definition, `.env.example`, Dockerfile, and `/health` endpoint. Database schemas and migrations will remain inside the service that owns them.

## Service port plan

| Component | Local port | Responsibility | Persistence |
|---|---:|---|---|
| Next.js web | 3000 | Browser UI | None |
| API Gateway | 4000 | Public API entry point and routing | None |
| Auth Service | 4001 | Registration, login, JWT validation/user data | Auth PostgreSQL database |
| Product Service | 4002 | Product listing, details, admin product operations | Product PostgreSQL database |
| Inventory Service | 4003 | Stock checks and stock reduction | In-memory |
| Cart Service | 4004 | Add, view, and clear user carts | In-memory |
| Order Service | 4005 | Checkout orchestration and order history | Order PostgreSQL database |
| Payment Service | 4006 | Fake payment authorization | None |
| Notification Service | 4007 | Order confirmation console logs | None |
| Auth PostgreSQL | 5433 | Auth Service database | Docker volume |
| Product PostgreSQL | 5434 | Product Service database | Docker volume |
| Order PostgreSQL | 5435 | Order Service database | Docker volume |

The three PostgreSQL containers use separate host ports for local development. Services may use container names and the PostgreSQL container port internally when running through Docker Compose.

## Planned checkout request path

```text
Browser
  └─ HTTP → API Gateway :4000
       └─ HTTP → Order Service :4005
            ├─ HTTP → Cart Service :4004
            ├─ HTTP → Inventory Service :4003
            ├─ HTTP → Payment Service :4006
            ├─ save order in Order PostgreSQL :5435
            ├─ HTTP → Notification Service :4007
            └─ HTTP → Cart Service :4004 (clear cart)
```

The order service will own the checkout sequence and will never access another service’s database directly. Kafka or RabbitMQ can be introduced later for selected asynchronous interactions, but neither will be implemented in this first version.

## Phase boundary

Phase 1 is complete when this structure and port plan are agreed. Phase 2 will create the service and frontend skeletons, Express/Next.js entry points, and health endpoints.
