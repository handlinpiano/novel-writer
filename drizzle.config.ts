import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.development.local' });

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config;