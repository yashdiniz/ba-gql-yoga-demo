import { makeSchema } from 'nexus';
import { join } from 'path';
import * as types from '@/schema/graphql';

export const schema = makeSchema({
    types,
    outputs: {
        schema: join(process.cwd(), 'generated/schema.graphql'),
        typegen: join(process.cwd(), 'generated/nexus-typegen.ts'),
    },
})