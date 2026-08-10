# Local API Routes Guide

This project uses **Next.js App Router API Route Handlers** under `src/app/api/` for mocking backend endpoints during frontend development.

---

## 1. How It Works

- All API routes are standard Next.js Route Handlers.
- `NEXT_PUBLIC_API_URL` points to `http://localhost:3000`.
- Both Client Components (Axios / TanStack Query) and Server Components (SSR) call `http://localhost:3000/api/...` seamlessly.
- When the real backend is ready, simply update `NEXT_PUBLIC_API_URL` in `.env` to point to the live backend URL (e.g. `http://localhost:8000`).

---

## 2. Active Auth Routes

- **Register**: [`src/app/api/auth/register/route.ts`](file:///home/amr-mohamed27/rewaa/src/app/api/auth/register/route.ts) (`POST /api/auth/register`)
- **Login**: [`src/app/api/auth/login/route.ts`](file:///home/amr-mohamed27/rewaa/src/app/api/auth/login/route.ts) (`POST /api/auth/login`)
- **Me**: [`src/app/api/auth/me/route.ts`](file:///home/amr-mohamed27/rewaa/src/app/api/auth/me/route.ts) (`GET /api/auth/me`)

---

## 3. How to Add a New API Route

To add a new endpoint, create a `route.ts` file inside `src/app/api/[your-path]/`.

### Example: Creating `GET /api/v1/products`

1. Create `src/app/api/v1/products/route.ts`:

```ts
import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

export async function GET() {
  const products = Array.from({ length: 5 }).map(() => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()),
  }));

  return NextResponse.json(
    {
      statusCode: 200,
      data: products,
    },
    { status: 200 }
  );
}
```

2. Call it from your frontend using Axios or Orval hooks:
```ts
const data = await api({ url: "/api/v1/products" });
```
