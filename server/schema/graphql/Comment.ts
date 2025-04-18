import { enumType, extendType, idArg, interfaceType, nonNull } from "nexus";
import { Node } from "./Node";
import { User } from "./User";
import { newReplyService } from "@/domains/reply";

const replySvc = newReplyService()

const VoteType = enumType({
    name: 'VoteType',
    members: ['UP', 'NO']
})

export const Comment = interfaceType({
    name: 'Comment',
    resolveType(data) {
        if ('title' in data) {
            return 'Link'
        } else if ('root' in data) {
            return 'Reply'
        } else {
            return null
        }
    },
    definition(t) {
        t.implements(Node)
        t.nonNull.field('author', {
            type: User,
            description: 'Author of the `Comment`',
            resolve(parent, args, ctx, info) {
                return replySvc.authorOfReply({
                    id: parent.id, signedInUser: ctx.signedInUser,
                })
            }
        })
        t.nonNull.int('voteCount', {
            description: 'Number of votes on the `Comment`',
            resolve(parent, args, ctx, info) {
                return replySvc.voteCountOfReply({
                    id: parent.id, signedInUser: ctx.signedInUser,
                })
            }
        })
        t.nonNull.boolean('hasVoted', {
            description: 'Has the `User` signed in voted on the `Comment` already?'
        })
        t.nonNull.date('createdAt', {
            description: '`Comment` creation time',
        })
    },
})

export const CommentQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('comment', {
            type: Comment,
            description: 'Get `Comment` by ID',
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

export const CommentMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.boolean('vote', {
            description: 'Vote on a `Comment`',
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
            description: 'Delete a `Comment`',
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