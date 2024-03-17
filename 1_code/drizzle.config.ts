import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/app/lib/drizzle.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    // @ts-ignore
    connectionString: process.env.POSTGRES_URL,
  },
} satisfies Config;
