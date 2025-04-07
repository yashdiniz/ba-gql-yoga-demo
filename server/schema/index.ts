import { makeSchema } from 'nexus';
import { connectionPlugin } from 'nexus/dist/plugins';
import { join } from 'path';
import * as types from '@/schema/graphql';

export const schema = makeSchema({
    types,
    outputs: {
        schema: join(process.cwd(), 'generated/schema.graphql'),
        typegen: join(process.cwd(), 'generated/nexus-typegen.ts'),
    },
    plugins: [
        connectionPlugin({
            cursorFromNode(node, args, ctx, info, forCursor) {
                console.log('cursorFromNode', { id: node.id, ref: node.createdAt })
                return types.serializeCursor({ id: node.id, ref: node.createdAt })
            },
        }),
    ],
})