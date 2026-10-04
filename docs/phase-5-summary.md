# Phase 5 — Synchronous HTTP Service Communication

No broker, queue, cache, or orchestration platform is used. All communication below is synchronous HTTP REST.

## Communication map

| Caller | HTTP target | Purpose | Local URL |
|---|---|---|---|
| Frontend | API Gateway | All backend requests | `http://localhost:4000` |
| API Gateway | Auth, Product, Inventory, Cart, Order, Payment, Notification | Transparent proxying | 4001–4007 |
| Cart Service | Product Service | Validate product before adding to cart | 4002 |
| Order Service | Cart Service | Read and clear the authenticated user's cart | 4004 |
| Order Service | Product Service | Read trusted product names and prices | 4002 |
| Order Service | Inventory Service | Check and reduce stock | 4003 |
| Order Service | Payment Service | Process fake payment | 4006 |
| Order Service | Notification Service | Log order confirmation | 4007 |

Every internal HTTP request has a configurable timeout (`HTTP_TIMEOUT_MS`, default 5000), forwards `x-request-id`, and maps downstream failures to a meaningful local response. The gateway forwards the client's `Authorization` header unchanged.

## Checkout sequence

```mermaid
sequenceDiagram
  participant Web as Next.js
  participant G as API Gateway
  participant O as Order Service
  participant C as Cart Service
  participant P as Product Service
  participant I as Inventory Service
  participant Pay as Payment Service
  participant N as Notification Service
  Web->>G: POST /api/orders/checkout + JWT
  G->>O: Proxy request + JWT + request ID
  O->>C: GET authenticated user's cart
  O->>P: GET each product
  O->>I: GET each stock record
  O->>O: Create PENDING order
  O->>Pay: POST payment
  alt Payment failed
    O->>O: PAYMENT_FAILED; keep cart and stock
  else Payment succeeded
    O->>I: POST reduce stock for each item
    alt Reduction failed
      O->>O: FAILED; document HTTP consistency limitation
    else Reduction succeeded
      O->>O: CONFIRMED + transaction ID
      O->>C: DELETE cart
      O->>N: POST confirmation
      N-->>O: Log message; failure does not cancel order
    end
  end
```

## Environment variables

Gateway: `AUTH_SERVICE_URL`, `PRODUCT_SERVICE_URL`, `INVENTORY_SERVICE_URL`, `CART_SERVICE_URL`, `ORDER_SERVICE_URL`, `PAYMENT_SERVICE_URL`, `NOTIFICATION_SERVICE_URL`, `HTTP_TIMEOUT_MS`.

Cart: `PRODUCT_SERVICE_URL`, `JWT_SECRET`, `HTTP_TIMEOUT_MS`.

Order: `DATABASE_URL`, `JWT_SECRET`, all five downstream service URLs, and `HTTP_TIMEOUT_MS`.

Docker Compose supplies container-to-container URLs; local development uses `http://localhost:<port>` values in each `.env.example`.

## Failure handling

| Failure | Result | Reason |
|---|---|---|
| Cart unavailable | Checkout returns `502`; no order is created | Cart is required to know what the user purchased |
| Product unavailable or missing | Checkout returns `502` or `404`; no order is created | Prices must come from Product Service |
| Empty cart | `400 EMPTY_CART`; no order is created | There is nothing to purchase |
| Insufficient inventory | `409`; pending order is not confirmed and stock is not reduced for that item | Stock cannot go negative |
| Payment ending in `0000` | `402 PAYMENT_FAILED`; order becomes `PAYMENT_FAILED`, cart remains | Payment failed before stock reduction |
| Inventory reduction after payment | `409 INVENTORY_REDUCTION_FAILED`; order becomes `FAILED` | HTTP calls are not one atomic transaction across services |
| Notification unavailable | Order remains `CONFIRMED`; failure is logged with request ID | Notification is non-critical after confirmation |

HTTP coupling means the caller must know the target URL, request shape, timeout, and failure behavior. A slow or unavailable dependency can affect the user request, and there is no distributed transaction or automatic rollback in this learning version.

## Run commands

```bash
pnpm install
docker compose up -d auth-db product-db order-db
pnpm --filter auth-service dev
pnpm --filter product-service dev
pnpm --filter inventory-service dev
pnpm --filter cart-service dev
pnpm --filter order-service dev
pnpm --filter payment-service dev
pnpm --filter notification-service dev
pnpm --filter api-gateway dev
```

Run the frontend separately with `pnpm --filter web dev`. The frontend uses `NEXT_PUBLIC_API_URL=http://localhost:4000`.

## Successful checkout walkthrough

1. Start databases and services.
2. Login through the gateway and copy the token:

```bash
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"customer@example.com","password":"DemoPass123!"}'
```

3. Add a seeded product to the authenticated cart:

```bash
curl -X POST http://localhost:4000/api/cart/<USER_ID>/items -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"productId":"product-001","quantity":1}'
```

4. Checkout with a successful fake card:

```bash
curl -X POST http://localhost:4000/api/orders/checkout -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"cardNumber":"4242424242424242","currency":"USD"}'
```

The response is a `CONFIRMED` order, inventory decreases, the cart is cleared, and Notification Service logs the confirmation.

## Validation

```bash
pnpm typecheck
pnpm build
pnpm -r test
```

The tests cover health endpoints for every service and gateway forwarding/request-ID behavior. Full checkout scenarios require all local services and databases running; the service boundaries and failure paths are implemented for that integration environment.
