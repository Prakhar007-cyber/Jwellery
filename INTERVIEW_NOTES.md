# ÉLANORA — Interview Notes

A plain-language guide to how this project works, and a set of likely interview questions with short answers. Everything here is written so a junior developer can explain it confidently.

---

## 1. Project Architecture (the big picture)

ÉLANORA is a **Next.js App Router** application. One codebase contains both the frontend (React) and the backend (API route handlers + database access).

- **Server Components** render pages on the server and can talk to MongoDB directly (e.g. the shop page fetches products before sending HTML).
- **Client Components** (`"use client"`) handle interactivity — cart, animations, forms.
- **API Route Handlers** (`src/app/api/**`) are small backend endpoints for actions like signup, checkout and admin operations.
- **MongoDB** stores products, users and orders; **Mongoose** defines the schemas and runs the queries.

## 2. How the Next.js frontend works

Pages live in `src/app`. Folders map to URLs. I use **route groups**:
- `(site)` shares the navbar/footer/smooth-scroll layout.
- `(auth)` is the login/signup screen with no chrome.
- `admin` is the protected admin area.

Most pages are Server Components (fast, SEO-friendly). Only the interactive pieces are Client Components, which keeps the JavaScript bundle small.

## 3. How MongoDB is connected

`src/lib/db.ts` exports `connectDB()`. Because Next.js hot-reloads in development, a naive `mongoose.connect` would open a new connection on every reload, so I **cache the connection on `globalThis`** and reuse it. Every query calls `await connectDB()` first.

## 4. Product schema (`src/lib/models/Product.ts`)

Fields: name, slug, description, price, compareAtPrice, category, collection, material, stone, images[], sizes[], stock, and flags like `featured` / `newArrival` / `bestSeller`. A **text index** on name/description powers search.

## 5. User schema (`src/lib/models/User.ts`)

Fields: name, email, **passwordHash** (never a plain password), image, `role` (`customer` | `admin`), addresses[], and wishlist[] (product ids). The `role` field is what drives admin access.

## 6. Order schema (`src/lib/models/Order.ts`)

Fields: user, email, a human-friendly `reference` (e.g. `ELN-8F3K2A`), items[] (with the **price captured at purchase time**), shippingAddress, subtotal, shipping, total, paymentStatus and orderStatus (Processing → Confirmed → Shipped → Delivered / Cancelled).

## 7. Authentication flow

I use **Auth.js (NextAuth v5)** with two providers:
- **Credentials** — on sign-in, `authorize()` looks up the user by email and compares the password to the stored bcrypt hash.
- **Google** — optional; only enabled when the Google env vars are set.

Sessions are **JWT** (stateless). In the `jwt` callback I copy the user's `id` and `role` into the token; in the `session` callback I expose them on `session.user`. That lets any server component or API check `session.user.role`.

## 8. Cart flow

Cart state is a small **React Context** (`CartProvider`) — no Redux/Zustand needed. It exposes `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getCartTotal`. The cart is saved to **localStorage** so it survives reloads. Adding an item bumps a counter that animates the bag icon and opens the drawer.

## 9. Wishlist flow

`WishlistProvider` stores the saved products in state + localStorage. When the user is signed in, it also syncs to MongoDB via `/api/wishlist` (`$addToSet` / `$pull` on the user's `wishlist` array), so the list follows them across devices.

## 10. Checkout flow

1. The user reviews their bag and enters contact + shipping details.
2. On "Place Order" the client POSTs to `/api/checkout` sending **only product ids, sizes and quantities** — no prices.
3. The server looks up the real products in MongoDB, computes the authoritative subtotal/shipping/total, runs the (mock) payment, and creates the Order.
4. The client clears the cart and shows the confirmation with the order reference.

## 11. Admin authorization

`requireAdmin()` (`src/lib/adminGuard.ts`) reads the session and returns it only if `role === "admin"`. Every admin **page** (via the admin layout) and every admin **API** calls it. Hiding buttons in the UI is not security — the server always re-checks.

## 12. How products are fetched

`src/lib/data.ts` has plain helper functions: `getProducts()`, `getFeaturedProducts()`, `getProductBySlug()`, `getRelatedProducts()`, `searchProducts()`. Each connects to the DB, runs a Mongoose query, and converts documents to plain objects (Server Components can only pass plain objects to Client Components).

## 13. How search/filtering works

- **Filtering:** the shop page reads the URL query string (`?category=rings&sort=price-asc`) and builds a Mongoose filter object. Because filters live in the URL, they're shareable and bookmarkable.
- **Search:** the overlay calls `/api/search?q=...` (debounced), which runs a case-insensitive regex query against name/material/stone/category.

## 14. Main GSAP animations

- **Hero:** an entrance timeline (image mask reveal + staggered headline) plus a **sticky + scrubbed ScrollTrigger** timeline that scales the full-bleed image into a framed campaign as you scroll — the signature transition.
- **Reveals:** `Reveal` / `RevealHeading` use `gsap.from(... scrollTrigger)` so the resting state is the fully-visible DOM and the animation just plays it in.
- **Parallax:** several sections nudge images with a scrubbed `yPercent` tween.
- **Lenis** smooth scroll is wired into GSAP's ticker so scroll-driven animations stay perfectly in sync.

## 15. Environment variables

`MONGODB_URI`, `AUTH_SECRET`, `NEXTAUTH_URL`, and optional `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`. Documented in `.env.example`; real values are git-ignored.

## 16. Important security decisions

- bcrypt password hashing.
- Server-authoritative order totals (never trust client prices).
- Server-side admin checks on every admin route.
- Zod validation on API inputs.
- Orders are scoped by user id, so people can only read their own.

---

## Likely Interview Questions

**1. Why did you use MongoDB?**
The data (products with variable fields, orders with embedded line items) is document-shaped and doesn't need complex joins. Mongoose gives me schemas and validation while keeping queries simple.

**2. Why Next.js?**
It lets me build the frontend and backend in one project, render pages on the server for speed/SEO, and colocate API routes with the UI — ideal for a full-stack e-commerce app.

**3. How does authentication work?**
Auth.js with a credentials provider. On login I compare the password to a bcrypt hash. Sessions are JWTs that carry the user's id and role, which I expose on `session.user`.

**4. How do you protect admin routes?**
`requireAdmin()` checks `session.user.role` on the server. The admin layout and every admin API call it, so even if someone hits the API directly they get a 403.

**5. How does "Add to Cart" work?**
A React Context stores the cart in state and localStorage. `addToCart` either increments an existing line (same product + size) or appends a new one, then opens the drawer.

**6. How are orders stored?**
In an `orders` collection. Each order has a reference, embedded items with the price captured at purchase, the shipping address, totals, and a status.

**7. How do you prevent users from changing product prices during checkout?**
The client only sends product ids, sizes and quantities. The server looks up the real prices in MongoDB and computes the total itself — client prices are ignored entirely.

**8. How does product filtering work?**
Filters live in the URL query string. The shop Server Component reads them and builds a Mongoose filter + sort. This makes filtered views shareable.

**9. How are your GSAP animations implemented?**
With `useGSAP` for automatic cleanup, `ScrollTrigger` for scroll-driven timelines, and Lenis wired into GSAP's ticker so smooth scrolling and animations stay in sync. `gsap.from()` keeps the visible DOM as the resting state.

**10. Why React Context instead of Redux?**
Cart and wishlist are small, self-contained slices of global state. Context + hooks covers them cleanly without the boilerplate of a larger state library.

**11. What's the difference between Server and Client Components here?**
Server Components (pages, data fetching) run on the server and never ship JS. Client Components (cart, forms, animations) run in the browser. Keeping most things server-side reduces the bundle.

**12. How does the wishlist persist for logged-in users?**
It's stored in localStorage for everyone, and additionally synced to the user's `wishlist` array in MongoDB via `/api/wishlist` when they're authenticated.

**13. How is the database seeded?**
`npm run seed` runs `seedDatabase()`, which clears and re-inserts the product catalogue and creates the admin + demo users. The same function auto-seeds the in-memory DB in dev.

**14. Why is the checkout total calculated on the server?**
Security. If the client sent prices, a user could tamper with them. The server is the single source of truth for pricing.

**15. How do you handle the fixed navbar changing color over the hero?**
The navbar tracks scroll position and whether it's on the home page. Over the dark hero it's transparent with light text; once you scroll it becomes a solid ivory glass bar with dark text.

**16. What happens if `MONGODB_URI` isn't set?**
In development the app spins up an in-memory MongoDB and auto-seeds it, so it runs with zero configuration. In production you always set a real connection string.

**17. How would you add real payments (Stripe/Razorpay)?**
The checkout route has a `processPayment()` function as a seam. I'd create a payment intent there before creating the order, keeping all secret keys on the server.

**18. What would you improve if this app had 100,000 users?**
Add pagination and indexed queries on the shop, cache product reads (or ISR/CDN), move sessions/rate-limiting to a shared store, add a real payment provider and webhooks, offload images to a CDN, and add monitoring. The schema and query patterns already support indexing.

**19. How do you keep the animations from hurting performance?**
Animations are GSAP contexts that clean up on unmount, respect `prefers-reduced-motion`, use transforms (GPU-friendly), and images go through `next/image` for lazy loading and optimization.

**20. Why did you split components the way you did?**
By feature and responsibility — one component per meaningful UI piece (Navbar, Hero, ProductCard, CartDrawer) without over-splitting into wrappers/providers/controllers. It stays easy to navigate and explain.
