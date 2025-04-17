import 'dotenv/config'

import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'
import env from '@/env'

export const db = drizzle({
    connection: {
        url: env.DATABASE_URL!,
    },
    schema,
})