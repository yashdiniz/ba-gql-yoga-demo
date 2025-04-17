import 'dotenv/config';
import z from 'zod';

/**
 * Added for ENV type safety (no need to use process.env everywhere)
 * This allows to have both type safety and autocompletion for the env.
 */
const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_KEY: z.string(),
    JWT_ISSUER: z.string(),
    JWT_AUDIENCE: z.string(),
})
export default {
    SERVER: 'http://localhost:3001',
    ...(envSchema.parse(process.env)),
}