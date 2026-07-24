import { config } from "dotenv";
// Load .env.local first (Next.js convention), then fall back to .env.
config({ path: ".env.local" });
config();

import { seedDatabase } from "../src/lib/seed";

/*
  CLI seed script — run with `npm run seed`.
  Populates the database configured by MONGODB_URI with the
  ÉLANORA product catalogue, an admin user and a demo customer.
*/

seedDatabase()
  .then((res) => {
    console.log(`✓ Seeded ${res.products} products.`);
    console.log("  Admin login:  admin@elanora.com / admin1234");
    console.log("  Demo login:   demo@elanora.com  / demo1234");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
