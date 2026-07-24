# ÉLANORA — Luxury Jewelry E-Commerce

> _Crafted to become part of your story._

ÉLANORA is a full-stack luxury jewelry storefront built with **Next.js (App Router), TypeScript, Tailwind CSS, MongoDB/Mongoose and Auth.js**. It pairs a cinematic, editorial landing page (GSAP + Lenis smooth scroll + Motion) with a genuinely functional e-commerce backend: authentication, product management, cart, wishlist, search, checkout, orders and an admin dashboard.

The design goal: **look like an established European jewelry house, while keeping the code simple and easy to explain.**

---

## ✦ Features

- **Cinematic landing page** — GSAP-driven hero with a scroll transition, editorial spreads, asymmetric category tiles, a signature collection campaign, scroll-driven product spotlight, marquee, bridal section and editorial gallery.
- **Authentication** — email/password (bcrypt-hashed) + optional Google, via Auth.js (NextAuth v5) with JWT sessions. Premium split-screen login/signup with an animated transition.
- **Shop** — filter by category / collection / material / availability and sort, all driven by URL query params.
- **Product pages** — image gallery, size selector, quantity, add-to-bag, wishlist and detail accordions, plus related products.
- **Cart** — React Context + localStorage, animated slide-in drawer.
- **Wishlist** — persists to localStorage for guests and to MongoDB for signed-in users.
- **Search** — full-screen overlay querying MongoDB live.
- **Checkout** — multi-step flow. **Totals are always recalculated on the server from the database** — client prices are never trusted. Payment is abstracted (mock) so Stripe/Razorpay can be added later.
- **Account** — profile, order history and order detail.
- **Admin** — protected dashboard with product CRUD and order-status management. Authorization is enforced **server-side**, not by hiding buttons.

---

## ✦ Tech Stack

| Area          | Choice                                        |
| ------------- | --------------------------------------------- |
| Framework     | Next.js 16 (App Router, Server Components)     |
| Language      | TypeScript                                    |
| Styling       | Tailwind CSS v4                               |
| Database      | MongoDB + Mongoose                            |
| Auth          | Auth.js / NextAuth v5 (JWT sessions)          |
| Animation     | GSAP + ScrollTrigger, Lenis, Motion           |
| Icons         | lucide-react                                  |
| Validation    | Zod                                           |

---

## ✦ Getting Started

### 1. Install

```bash
npm install
```

### 2. Environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

```env
MONGODB_URI=            # leave EMPTY for a zero-config in-memory DB (dev only)
AUTH_SECRET=            # any long random string (npx auth secret)
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=       # optional — enables "Continue with Google"
GOOGLE_CLIENT_SECRET=   # optional
```

> **Three ways to provide MongoDB — pick one:**
>
> **A. Bundled local MongoDB (recommended, no install).** `.env.local` ships pointing at `mongodb://127.0.0.1:27017/elanora`. In a **separate terminal** run:
> ```bash
> npm run db        # starts MongoDB (bundled binary) at ./.mongo-data — leave running
> ```
> **B. MongoDB Atlas / your own MongoDB.** Set `MONGODB_URI` to your connection string.
>
> **C. Zero-config in-memory.** Leave `MONGODB_URI` empty; the app boots a disposable in-memory MongoDB and auto-seeds it (handy, but slower to start on some machines).

### 3. Seed the database (options A and B)

```bash
npm run seed
```

This inserts ~23 jewelry products and creates two demo accounts:

| Role     | Email               | Password    |
| -------- | ------------------- | ----------- |
| Admin    | `admin@elanora.com` | `admin1234` |
| Customer | `demo@elanora.com`  | `demo1234`  |

### 4. Run

```bash
npm run dev          # http://localhost:3000  (dev, hot reload)
```

### 5. Production build

```bash
npm run build
npm start            # http://localhost:3000  (optimized production server)
```

---

## ✦ Codebase Walkthrough

The 10 most important files/folders:

| Path | What it does |
| ---- | ------------ |
| `src/app/(site)/page.tsx` | The landing page — a Server Component that fetches featured products and composes all the home sections. |
| `src/components/home/` | The landing page sections (Hero, EditorialIntro, ShopByCategory, SignatureCollection, …). GSAP/Motion animations live next to the markup they animate. |
| `src/lib/db.ts` | The single, cached MongoDB connection helper (`connectDB()`), with a dev-only in-memory fallback. |
| `src/lib/models/` | The three Mongoose schemas: `Product`, `User`, `Order`. |
| `src/lib/data.ts` | Server-side data helpers — plain Mongoose queries returning JSON-safe objects (used by shop, PDP, home). |
| `src/lib/auth.ts` | Auth.js configuration: credentials + Google providers, JWT session, role in the token. |
| `src/app/api/checkout/route.ts` | Order creation — recomputes the authoritative total from the DB and never trusts client prices. |
| `src/app/api/admin/` | Admin product/order APIs, each guarded server-side by `requireAdmin()`. |
| `src/components/providers/` | Global React Contexts: cart, wishlist, toasts (+ the NextAuth session provider). |
| `src/lib/seed.ts` | The product catalogue + `seedDatabase()`, shared by the CLI seed and the dev auto-seed. |

Route groups keep layouts clean:
- `(site)` — storefront with navbar/footer, smooth scroll and custom cursor.
- `(auth)` — the split-screen login/signup, no chrome.
- `admin` — the protected admin area.

---

## ✦ Security Notes

- Passwords are stored as **bcrypt hashes**, never plain text.
- Order totals are **calculated server-side** from database prices.
- Admin APIs verify the session role **on the server** (`requireAdmin()`), independent of the UI.
- Server inputs are validated with **Zod**.
- Secrets live in environment variables; `.env.example` documents them and real secrets are git-ignored.

See `INTERVIEW_NOTES.md` for a plain-language explanation of the architecture and likely interview questions.
