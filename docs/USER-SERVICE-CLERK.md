# User data with Clerk (profile, cart, orders)

Clerk handles **who the user is** (login, session, `userId`). Your **user-service** stores **extra data** for that user: profile, cart, and (optionally) order list—all keyed by Clerk’s `userId`.

## Flow

1. User signs in with Clerk on the client (e.g. `http://localhost:3002`).
2. Client gets a session token (`getToken()`) and sends it to your APIs as `Authorization: Bearer <token>`.
3. **user-service** (and order-service, product-service) verify the token with Clerk and get `userId`.
4. user-service uses `userId` to read/write **UserProfile** and **Cart** in its DB. Order list lives in **order-service** (Order table has `userId`); you can expose it via order-service or from user-service by calling order-service.

## What’s in user-service

| Endpoint | Description |
|----------|-------------|
| `GET /users/me` | Get or create profile for the logged-in user |
| `PUT /users/me` | Update profile (fullName, phone, address, city, country, avatarUrl) |
| `GET /users/me/cart` | Get current cart (with items) |
| `POST /users/me/cart/items` | Add item: `{ productId, quantity?, size?, color? }` |
| `PATCH /users/me/cart/items/:itemId` | Update quantity: `{ quantity }` (0 = remove) |
| `DELETE /users/me/cart/items/:itemId` | Remove item from cart |

All routes require **Authorization: Bearer <token>** (same as product-service).

## DB (user-db)

- **UserProfile**: `userId` (Clerk), fullName, avatarUrl, phone, address, city, country.
- **Cart** / **CartItem**: one cart per `userId`; items reference `productId` (from product-service).

Use the **same** PostgreSQL instance as other services or a dedicated DB; set `DATABASE_URL` in user-service (and when running migrations for user-db).

## Order list

- **order-service** already has an Order model with `userId`. Add an endpoint there, e.g. `GET /orders` (with auth), that returns orders where `order.userId === req.userId`.
- From the client, call order-service with the same Bearer token to get “my orders.” Optionally, user-service could proxy “my orders” by calling order-service with the user’s token.

## Client usage

After sign-in, get the token and call user-service:

```ts
const token = await getToken();
const res = await fetch("http://localhost:8004/users/me", {
  headers: { Authorization: `Bearer ${token}` },
});
const profile = await res.json();

// Cart
const cartRes = await fetch("http://localhost:8004/users/me/cart", {
  headers: { Authorization: `Bearer ${token}` },
});
const cart = await cartRes.json();

// Add to cart
await fetch("http://localhost:8004/users/me/cart/items", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ productId: "abc123", quantity: 2, size: "m", color: "blue" }),
});
```

## Run

1. In `packages/user-db`: set `DATABASE_URL` in `.env`, then `npm run db:generate` and `npm run db:push`.
2. In `apps/user-service`: set `.env` (Clerk keys + `DATABASE_URL`), then `npm run dev` (default port 8004).
