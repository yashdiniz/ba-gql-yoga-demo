import { arg, enumType, extendType, idArg, nonNull, objectType, stringArg } from "nexus";
import { Node } from "./Node";
import { User } from "./User";
import { newReplyService, type ReplyOutput } from "@/domains/reply";
import { parseCursor, serializeCursor } from "./utils";

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
                return replySvc.rootOfReply({
                    id: parent.id, signedInUser: ctx.signedInUser,
                })
            }
        })
        t.field('parent', {
            type: Reply,
            description: 'Parent of the `Reply`',
            resolve(parent, args, ctx, info) {
                return replySvc.parentOfReply({
                    id: parent.id, signedInUser: ctx.signedInUser,
                })
            }
        })
        t.nonNull.field('author', {
            type: User,
            description: 'Author of the `Reply`',
            resolve(parent, args, ctx, info) {
                return replySvc.authorOfReply({
                    id: parent.id, signedInUser: ctx.signedInUser,
                })
            }
        })
        t.nonNull.int('voteCount', {
            description: 'Number of votes on the `Reply`',
            resolve(parent, args, ctx, info) {
                return replySvc.voteCountOfReply({
                    id: parent.id, signedInUser: ctx.signedInUser,
                })
            }
        })
        t.nonNull.boolean('hasVoted', {
            description: 'Has the `User` signed in voted on the post already?'
        })
        t.string('title', {
            description: '`Reply` title (only used in Links/Posts)',
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
            nodes(parent, args, ctx, info) {
                return replySvc.feed({
                    first: args.first,
                    after: args.after ? parseCursor(args.after) : null,
                    signedInUser: ctx.signedInUser,
                })
            },
            cursorFromNode(node, args, ctx, info) {
                return node ? serializeCursor({ i: node.id, v: null })
                    : ""
            }
        })
        t.nonNull.list.field('replies', {
            type: Reply,
            description: 'Get nested replies of a root `Link`. NOTE: only works for `Link`s, will fail for non-links.',
            args: {
                rootId: nonNull(idArg()),
            },
            resolve(parent, args, ctx, info) {
                return replySvc.repliesOfRoot({
                    id: args.rootId, signedInUser: ctx.signedInUser,
                })
            },
        })
        t.nonNull.field('reply', {
            type: Reply,
            description: 'Get reply by ID',
            args: {
                id: nonNull(idArg()),
            },
            resolve(parent, args, ctx, info) {
                return replySvc.reply({
                    id: args.id,
                    signedInUser: ctx.signedInUser,
                })
            }
        })
    },
})

export const ReplyMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('post', {
            type: Reply,
            description: 'Post a `Reply` (Link) to the feed',
            args: {
                title: nonNull(stringArg()),
                content: stringArg(),
            },
            resolve(parent, args, ctx) {
                const { title, content } = args
                return replySvc.makePost({
                    signedInUser: ctx.signedInUser,
                    title, content: content ?? null,
                })
            }
        })
        t.nonNull.field('reply', {
            type: Reply,
            description: '`Reply` to another reply (nested comment support)',
            args: {
                parentId: nonNull(idArg()),
                content: nonNull(stringArg()),
            },
            resolve(parent, args, ctx) {
                const { parentId, content } = args
                return replySvc.makeReply({
                    parentId, content, signedInUser: ctx.signedInUser,
                })
            }
        })
        t.nonNull.boolean('vote', {
            description: 'Vote on a `Reply`',
            args: {
                replyId: nonNull(idArg()),
                type: nonNull(VoteType), // idempotency
            },
            resolve(parent, args, ctx, info) {
                const { replyId, type } = args
                return replySvc.voteOnReply({
                    replyId, type, signedInUser: ctx.signedInUser,
                })
            }
        })
        t.nonNull.boolean('delete', {
            description: 'Delete a `Reply`',
            args: {
                replyId: nonNull(idArg()),
            },
            resolve(parent, args, ctx, info) {
                const { replyId } = args
                return replySvc.deleteReply({
                    replyId, signedInUser: ctx.signedInUser,
                })
            }
        })
    },
})