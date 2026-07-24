import { spawn } from "node:child_process";
import { readdirSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

/*
  Starts a local MongoDB using the binary that mongodb-memory-server
  already downloaded, pointed at a persistent ./.mongo-data folder on
  port 27017. This gives fast, persistent local development without
  installing MongoDB separately.

  Usage:  npm run db        (leave it running in its own terminal)
  Then:   npm run seed  &&  npm run dev
*/

const cacheDir = path.resolve("node_modules/.cache/mongodb-memory-server");
if (!existsSync(cacheDir)) {
  console.error(
    "No MongoDB binary found. Run `npm install` first (it downloads one via mongodb-memory-server),\n" +
      "or set MONGODB_URI in .env.local to your own MongoDB / Atlas connection string."
  );
  process.exit(1);
}

const binary = readdirSync(cacheDir).find((f) => f.startsWith("mongod") && f.endsWith(".exe"))
  || readdirSync(cacheDir).find((f) => f.startsWith("mongod"));

if (!binary) {
  console.error("Could not locate the mongod binary in", cacheDir);
  process.exit(1);
}

const dataDir = path.resolve(".mongo-data");
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

console.log("Starting MongoDB on mongodb://127.0.0.1:27017 (data: ./.mongo-data)…");
const child = spawn(
  path.join(cacheDir, binary),
  ["--dbpath", dataDir, "--port", "27017", "--bind_ip", "127.0.0.1"],
  { stdio: "inherit" }
);

child.on("exit", (code) => process.exit(code ?? 0));
