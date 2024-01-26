import { Config } from 'drizzle-kit'
export default ({
  schema: "./src/db/schema",
  driver: 'pg',
  dbCredentials: {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_URL,
    ssl?: boolean
  },
  out: "./drizzle",
}) satisfies Config;
