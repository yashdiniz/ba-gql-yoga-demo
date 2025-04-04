import { enumType, extendType, idArg, nonNull, objectType, stringArg } from "nexus";
import { Node } from "./Node";
import { User } from "./User";

const VoteType = enumType({
    name: 'VoteType',
    members: ['UP', 'NO']
})

export const Reply = objectType({
    name: 'Reply',
    definition(t) {
        t.implements(Node)
        t.field('root', {
            type: Reply,
            description: 'Root of the `Reply`',
        })
        t.field('parent', {
            type: Reply,
            description: 'Parent of the `Reply`',
        })
        t.field('author', {
            type: User,
            description: 'Author of the `Reply`',
        })
        t.nonNull.int('votes', {
            description: 'Number of votes on the `Reply`',
        })
        t.nonNull.boolean('hasVoted', {
            description: 'Has the `User` signed in voted on the post already?'
        })
        t.string('title', {
            description: '`Reply` title',
        })
        t.string('url', {
            description: '`Reply` attached URL',
        })
        t.string('content', {
            description: '`Reply` content',
        })
        t.nonNull.int('depth', {
            description: '`Reply` depth level (used for rendering)',
        })
        t.nonNull.boolean('isLink', {
            description: 'Is the `Reply` a link?',
        })
        t.nonNull.string('createdAt', {
            description: '`Reply` creation time',
        })
    },
})

export const ReplyQuery = extendType({
    type: 'Query',
    definition(t) {
        // TODO: use relay connection
        t.nonNull.list.field('feed', {
            type: Reply,
            description: 'Get the feed',
            resolve(parent, args, context, info) {
                // TODO: move to svc later
                return []
            },
        })
        // TODO: use relay connection
        t.nonNull.list.field('replies', {
            type: Reply,
            description: `
                Get nested replies of a root \`Link\`
                NOTE: only works for \`Link\`s, will fail for non-links.
            `,
            resolve(parent, args, context, info) {
                // TODO: move to svc later
                return []
            }
        })
    },
})

export const ReplyMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('post', {
            type: Reply,
            description: 'Post a `Reply` to the feed',
            args: {
                url: nonNull(stringArg()),
                title: nonNull(stringArg()),
                content: stringArg(),
            },
            resolve(parent, args, context) {
                // TODO: move to svc later
                const { url, title, content } = args
                return { id: 'd', title, url, content }
            }
        })
        t.nonNull.field('reply', {
            type: Reply,
            description: '`Reply` to another reply (nested comment support)',
            args: {
                parentId: nonNull(idArg()),
                content: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                // TODO: move to svc later
                const { parentId, content } = args
                return { id: parentId, content }
            }
        })
        t.nonNull.int('vote', {
            description: 'Vote on a `Reply`, get current vote count after action.',
            args: {
                replyId: nonNull(idArg()),
                type: nonNull(VoteType), // idempotency
            },
            resolve(parent, args, context, info) {
                // TODO: move to svc later
                return 0
            }
        })
    },
})