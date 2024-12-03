import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();

export default {
  schema: './src/database/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true',
  },
} satisfies Config;
