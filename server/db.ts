import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";
import path from "path";
import fs from "fs";

// Vercel: filesystem is read-only except /tmp
// Local/Railway: use ./data (persists across restarts)
const isVercel = !!process.env.VERCEL;
const dataDir = isVercel ? "/tmp" : path.join(process.cwd(), "data");

if (!isVercel && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(path.join(dataDir, "shamsak.db"));
export const db = drizzle(sqlite, { schema });
