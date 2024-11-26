import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: './src/database/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'helpdesk_user',
    password: process.env.DB_PASSWORD || 'development_password',
    database: process.env.DB_NAME || 'helpdesk_db',
  },
} satisfies Config;