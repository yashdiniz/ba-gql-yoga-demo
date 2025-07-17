import z from 'zod';

/**
 * Added for ENV type safety (no need to use process.env everywhere)
 * This allows to have both type safety and autocompletion for the env.
 */
const envSchema = z.object({})
const config = {
    SERVER: 'http://localhost:3000',
    ...(envSchema.parse({})),
}

export default config;