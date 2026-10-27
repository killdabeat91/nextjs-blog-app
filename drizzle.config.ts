import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"
import fs from "fs"

// Load .env.test in test/CI environment, otherwise .env.local
const envFile =
  process.env.NODE_ENV === "test" ||
  process.env.CI ||
  fs.existsSync(".env.test")
    ? ".env.test"
    : ".env.local"

dotenv.config({ path: envFile })
if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" })
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
