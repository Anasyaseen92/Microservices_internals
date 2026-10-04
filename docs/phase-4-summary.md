# Phase 4 — Independent REST APIs

All APIs in this phase are independent. There are no service-to-service HTTP calls, brokers, Redis, or orchestration. Each service exposes its OpenAPI placeholder at `GET /docs`.

## Auth Service — `http://localhost:4001`

- `POST /api/auth/register` — body `{ "name": "Jane Doe", "email": "jane@example.com", "password": "Password123!" }`; returns `201 { data: { id, name, email, role, createdAt, updatedAt } }`.
- `POST /api/auth/login` — body `{ "email": "customer@example.com", "password": "DemoPass123!" }`; returns `{ data: { token, user } }`.
- `GET /api/auth/me` — header `Authorization: Bearer <token>`; returns `{ data: safeUser }`.

Passwords are bcrypt-hashed and never returned. JWTs use `JWT_SECRET`.

## Product Service — `http://localhost:4002`

- `GET /api/products?search=headphones&category=Electronics&sort=price_asc&page=1&limit=12` — returns `{ data: [...], meta: { page, limit, total, totalPages } }`.
- `GET /api/products/:id` — returns `{ data: product }`.
- `POST /api/products` — requires temporary `x-admin-key: admin-dev-key`; body `{ "name": "Desk", "description": "Useful desk", "price": 99, "imageUrl": "https://example.com/desk.jpg", "category": "Home" }`.
- `PATCH /api/products/:id` — same temporary header; body may contain any product fields.
- `DELETE /api/products/:id` — same temporary header; returns `204`.

## Inventory Service — `http://localhost:4003`

- `GET /api/inventory` — returns `{ data: [{ productId, quantity }] }`.
- `GET /api/inventory/:productId` — returns one stock record.
- `POST /api/inventory` — body `{ "productId": "product-001", "quantity": 10 }`.
- `PATCH /api/inventory/:productId` — body `{ "quantity": 20 }`.
- `POST /api/inventory/:productId/reduce` — body `{ "quantity": 2 }`; rejects negative stock with `409`.
- `POST /api/inventory/:productId/restore` — body `{ "quantity": 2 }`.

The store is in memory and is seeded with `product-001` through `product-012`.

## Cart Service — `http://localhost:4004`

- `GET /api/cart/:userId` — returns `{ data: { userId, items: [{ productId, quantity }] } }`.
- `POST /api/cart/:userId/items` — body `{ "productId": "product-001", "quantity": 2 }`.
- `PATCH /api/cart/:userId/items/:productId` — body `{ "quantity": 3 }`.
- `DELETE /api/cart/:userId/items/:productId` — removes one item.
- `DELETE /api/cart/:userId` — clears the cart.

Cart stores only product IDs and quantities. Product validation is intentionally deferred to the HTTP communication phase.

## Order Service — `http://localhost:4005`

- `GET /api/orders/:userId` — returns that user's orders and items.
- `GET /api/orders/:userId/:orderId` — returns one order.
- `POST /api/orders` — body `{ "userId": "user-id", "items": [{ "productId": "product-001", "productName": "Aurora Wireless Headphones", "price": 129.99, "quantity": 1 }] }`; creates a `PENDING` order and calculates the total from received items.

Checkout orchestration is not implemented yet.

## Payment Service — `http://localhost:4006`

- `POST /api/payments/process` — body `{ "cardNumber": "4242424242424242", "amount": 129.99, "currency": "USD" }`; returns a transaction ID and `SUCCESS`.
- `POST /api/payments/process` with a card ending in `0000` returns `402` and `FAILED`.
- `GET /api/payments/:transactionId` — returns the stored fake transaction without card data.

## Notification Service — `http://localhost:4007`

- `POST /api/notifications/order-confirmation` — body `{ "userId": "user-id", "orderId": "order-id", "totalAmount": 129.99 }`; logs a confirmation and returns `202 { data: { accepted: true } }`.

## Samples

```bash
curl http://localhost:4002/api/products
curl -X POST http://localhost:4003/api/inventory/product-001/reduce -H "Content-Type: application/json" -d "{\"quantity\":2}"
curl -X POST http://localhost:4006/api/payments/process -H "Content-Type: application/json" -d "{\"cardNumber\":\"4242424242424242\",\"amount\":25,\"currency\":\"USD\"}"
```

## Tests and validation

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm -r test
```

The current tests verify the health endpoint and request middleware for every backend service. The next phase will connect the frontend/API Gateway and add synchronous HTTP calls for auth, catalog, cart, inventory, payments, notifications, and checkout orchestration.
