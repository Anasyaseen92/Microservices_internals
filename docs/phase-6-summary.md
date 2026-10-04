# Phase 6 — Next.js Frontend

## Routes and features

| Route | Features |
|---|---|
| `/` | Hero, featured products, benefits, responsive footer |
| `/products` | Search, category filter, sorting, pagination, loading/empty/error states |
| `/products/[id]` | Product detail, quantity selector, add to cart |
| `/login` | Zod + React Hook Form login and JWT storage |
| `/register` | Validated account creation |
| `/cart` | Protected cart, product details, quantity changes, removal, summary |
| `/checkout` | Protected fake payment form and checkout result |
| `/orders` | Protected order history and status badges |
| `/admin/products` | Admin-only catalog management, create/edit/delete, confirmation dialog |

## API Gateway-only communication

All browser API calls are defined in `apps/web/lib/api-client.ts`. The base URL is `NEXT_PUBLIC_API_GATEWAY_URL`, defaulting to `http://localhost:4000`. The frontend never calls Auth, Product, Cart, Order, Inventory, Payment, or Notification ports directly. Protected calls attach `Authorization: Bearer <token>` from local storage.

## Authentication flow

1. Login calls `/api/auth/login` through the gateway.
2. The client stores the JWT and safe user object in browser local storage.
3. Protected API methods attach the JWT automatically.
4. Navbar state and cart count react to the `auth-change` browser event.
5. Logout clears both values and updates the navbar.
6. Admin UI is shown only for a locally stored `ADMIN` role and uses the existing `x-admin-key` placeholder through the gateway.

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
pnpm --filter web dev
```

Open `http://localhost:3000`. The frontend environment file is `apps/web/.env.example` and contains `NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:4000`.

## Manual testing checklist

- [ ] Start PostgreSQL and all backend services.
- [ ] Open the frontend and confirm featured products load through port 4000 only.
- [ ] Register a new account or use `customer@example.com` / `DemoPass123!`.
- [ ] Browse, search, filter, sort, and paginate products.
- [ ] Open a product, change quantity, and add it to the cart.
- [ ] Confirm the navbar cart badge updates.
- [ ] Update quantity and remove an item from the cart.
- [ ] Checkout with `4242424242424242`; confirm the order and transaction ID.
- [ ] Open My Orders and confirm the `CONFIRMED` order.
- [ ] Retry checkout with a card ending in `0000`; confirm the friendly payment error.
- [ ] Login as `admin@example.com` / `DemoPass123!`; create, edit, and delete a product in Admin Products.
- [ ] Login as a customer and confirm the admin page shows access denied.
- [ ] Logout and confirm protected pages redirect to login.

## Validation

```bash
pnpm typecheck
pnpm build
pnpm -r test
```
