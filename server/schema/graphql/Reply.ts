import { arg, enumType, extendType, idArg, nonNull, objectType, stringArg } from "nexus";
import { Node } from "./Node";
import { User } from "./User";
import { newReplyService } from "@/domains/reply";
import type { NexusGenObjects } from "@/generated/nexus-typegen";
import { connectionFromArray } from "graphql-relay";
import { serializeCursor } from "./utils";

const replySvc = newReplyService()

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
            resolve(parent, args, ctx, info) {
                return replySvc.rootOfReply(parent.id)
            }
        })
        t.field('parent', {
            type: Reply,
            description: 'Parent of the `Reply`',
            resolve(parent, args, ctx, info) {
                return replySvc.parentOfReply(parent.id)
            }
        })
        t.nonNull.field('author', {
            type: User,
            description: 'Author of the `Reply`',
            resolve(parent, args, ctx, info) {
                return replySvc.authorOfReply(parent.id)
            }
        })
        t.nonNull.int('voteCount', {
            description: 'Number of votes on the `Reply`',
        })
        t.nonNull.int('replyCount', {
            description: 'Number of replies on the `Reply`',
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
        t.nonNull.boolean('isLink', {
            description: 'Is the `Reply` a link?',
        })
        t.nonNull.date('createdAt', {
            description: '`Reply` creation time',
        })
    },
})

export const ReplyQuery = extendType({
    type: 'Query',
    definition(t) {
        t.connectionField('feed', {
            type: Reply,
            disableBackwardPagination: true,
            description: 'Get the feed',
            async resolve(parent, args, context, info) {
                console.log('Query.feed resolve', info.fieldNodes)
                // const data = replySvc.feed({
                //     first: args.first, after: args.after,

                // })
                return connectionFromArray<NexusGenObjects['Reply']>(/*data*/[{
                    id: '0',
                    isLink: true,
                    createdAt: new Date(),
                    hasVoted: false,
                    replyCount: 0,
                    voteCount: 0,
                }, {
                    id: '1',
                    isLink: true,
                    createdAt: new Date(),
                    hasVoted: false,
                    replyCount: 0,
                    voteCount: 0,
                }], args)
            },
            cursorFromNode(node, args, ctx, info, forCursor) {
                console.log('Query.feed cursorFromNode', info.fieldNodes)
                return node ? serializeCursor({ i: node.id, v: node.createdAt })
                    : ""
            }
        })
        t.connectionField('replies', {
            type: Reply,
            disableBackwardPagination: true,
            description: 'Get nested replies of a root `Link`. NOTE: only works for `Link`s, will fail for non-links.',
            additionalArgs: {
                rootId: nonNull(idArg()),
            },
            resolve(parent, args, context, info) {
                // TODO: move to svc later
                return []
            }
        })
        t.nonNull.field('reply', {
            type: Reply,
            description: 'Get reply by ID',
            args: {
                id: nonNull(idArg()),
            },
            resolve(parent, args, context, info) {
                // TODO: move to svc later
                return null
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