import dotenv from "dotenv";
import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env"), quiet: true });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run migrations.");
}

const shouldUseSSL =
  process.env.DATABASE_SSL === "true" || DATABASE_URL.includes("supabase.co");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
});

const schemaFile = path.join(__dirname, "../db/schema.sql");
const schemaSql = await fs.readFile(schemaFile, "utf8");

const client = await pool.connect();

try {
  await client.query("BEGIN");
  await client.query(schemaSql);
  await client.query("COMMIT");
  console.log("Migration complete.");
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Migration failed:", error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
