import { extendType, nonNull, objectType, stringArg } from "nexus"
import { newReplyService } from "@/domains/reply"
import { Comment } from "./Comment"
import { parseCursor, serializeCursor } from "./utils"
import { Reply } from "./Reply"

const replySvc = newReplyService()

export const Link = objectType({
    name: 'Link',
    definition(t) {
        t.implements(Comment)
        t.nonNull.list.field('replies', {
            type: Reply,
            description: 'Get nested replies of a root `Link`.',
            resolve(parent, args, ctx, info) {
                return replySvc.repliesOfRoot({
                    id: parent.id, signedInUser: ctx.signedInUser,
                })
            },
        })
        t.nonNull.string('title', {
            description: '`Link` title',
        })
        t.string('content', {
            description: '`Link` content',
        })
    },
})

export const LinkQuery = extendType({
    type: 'Query',
    definition(t) {
        t.connectionField('feed', {
            type: Link,
            disableBackwardPagination: true,
            description: 'Get the feed',
            nodes(parent, args, ctx, info) {
                return replySvc.feed({
                    first: args.first + 1,
                    after: args.after ? parseCursor(args.after) : null,
                    signedInUser: ctx.signedInUser,
                })
            },
            cursorFromNode(node, args, ctx, info) {
                return node ? serializeCursor({ i: node.id, v: null })
                    : ""
            }
        })
    },
})

export const LinkMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('post', {
            type: Link,
            description: 'Post a `Link` to the feed',
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
    },
})