import mongoose from "mongoose";

/*
  MongoDB connection helper.
  ------------------------------------------------------------
  Next.js hot-reloads modules in development, which can open a
  new database connection on every reload. We cache a single
  connection on `globalThis` so we reuse it across reloads.

  In production you set MONGODB_URI (MongoDB Atlas or a real
  MongoDB server). For zero-config local demos, if MONGODB_URI
  is missing we spin up an in-memory MongoDB so the whole app
  still runs — see getMongoUri() below.
*/

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Reuse a single connection across hot reloads / serverless invocations.
const globalForMongoose = globalThis as unknown as { mongoose?: Cached };
const cached: Cached = globalForMongoose.mongoose ?? { conn: null, promise: null };
globalForMongoose.mongoose = cached;

let usingMemoryDb = false;

async function getMongoUri(): Promise<string> {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  // Dev fallback: launch an in-memory MongoDB the first time it's needed.
  // This keeps the project runnable out-of-the-box without installing MongoDB.
  usingMemoryDb = true;
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const globalForMemory = globalThis as unknown as { __mongoMemory?: unknown };
  const mem = (globalForMemory.__mongoMemory ??=
    await MongoMemoryServer.create({ instance: { dbName: "elanora" } })) as {
    getUri: () => string;
  };
  return mem.getUri();
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = getMongoUri()
      .then((uri) => mongoose.connect(uri, { bufferCommands: false }))
      .then(async (conn) => {
        // When running on the disposable in-memory DB, seed it once so the
        // app has products to show out-of-the-box. Real databases are seeded
        // explicitly with `npm run seed`.
        if (usingMemoryDb) {
          const { Product } = await import("./models/Product");
          if ((await Product.estimatedDocumentCount()) === 0) {
            const { seedDatabase } = await import("./seed");
            await seedDatabase();
          }
        }
        return conn;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
