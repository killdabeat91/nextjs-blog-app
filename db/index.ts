import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"
import * as dotenv from "dotenv"
import fs from "fs"

if (!process.env.DATABASE_URL) {
  if (fs.existsSync(".env.test")) {
    dotenv.config({ path: ".env.test" })
  }
  if (fs.existsSync(".env.local")) {
    dotenv.config({ path: ".env.local" })
  }
}

const sql = neon(process.env.DATABASE_URL || "")
export const db = drizzle(sql, { schema })
