import { defineConfig } from 'drizzle-kit';
import env from './env';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});