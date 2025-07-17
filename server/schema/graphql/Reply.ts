import { extendType, idArg, nonNull, objectType, stringArg } from "nexus";
import { newReplyService } from "@/domains/reply";
import { Comment } from "./Comment";
import { Link } from "./Link";

const replySvc = newReplyService()

export const Reply = objectType({
    name: 'Reply',
    definition(t) {
        t.implements(Comment)
        t.field('root', {
            type: Link,
            description: 'Root of the `Reply`',
            resolve(parent, args, ctx, info) {
                return replySvc.rootOfReply({
                    id: parent.id, signedInUser: ctx.signedInUser,
                })
            }
        })
        t.field('parent', {
            type: Comment,
            description: 'Parent of the `Reply`',
            resolve(parent, args, ctx, info) {
                return replySvc.parentOfReply({
                    id: parent.id, signedInUser: ctx.signedInUser,
                })
            }
        })
        t.string('content', {
            description: '`Reply` content',
            resolve(parent, args, ctx, info) {
                return parent.title
            }
        })
    },
})

export const ReplyMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('reply', {
            type: Reply,
            description: '`Reply` to a `Comment` (nested comment support)',
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
    },
})