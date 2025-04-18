import { enumType, nonNull, objectType, extendType, idArg, stringArg, scalarType } from "nexus";
import { Reply } from "./Reply";
import { Node } from "./Node";
import { parseCursor, serializeCursor } from "./utils";
import { newUserService } from "@/domains/user";

const userSvc = newUserService();

const ReplyTypeInput = enumType({
    name: 'ReplyTypeInput',
    members: ['LINKS_REPLIES', 'LINKS', 'REPLIES', 'VOTED'],
})

export const User = objectType({
    name: 'User',
    definition(t) {
        t.implements(Node)
        t.connectionField('replies', {
            type: Reply,
            description: 'Replies by the `User`',
            additionalArgs: {
                type: nonNull(ReplyTypeInput),
                userId: nonNull(idArg()),
            },
            nodes(root, args, ctx, info) {
                const { first, after, type, userId } = args
                return userSvc.getUserReplies({
                    first: first ?? 10,
                    after: after ? parseCursor(after) : null,
                    replyType: type, userId, signedInUser: ctx.signedInUser,
                })
            },
            cursorFromNode(node, args, ctx, info, forCursor) {
                console.log('Query.replies cursorFromNode', info.fieldNodes)
                return node ? serializeCursor<Date>({ i: node.id, v: node.createdAt })
                    : ""
            }
        })
        t.nonNull.string('name', {
            description: '`User` name',
        })
        t.string('about', {
            description: '`User` bio, describing themselves'
        })
        t.nonNull.date('createdAt', {
            description: '`User` creation time',
        })
    }
})

export const UserQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('profile', {
            type: User,
            description: 'Get profile of `User` by name or ID',
            args: {
                id: idArg(),
                name: stringArg(),
            },
            resolve(parent, args, context, info) {
                if (args.id) return userSvc.getUserById({ id: args.id })
                else if (args.name) return userSvc.getUserByName({ name: args.name })
                else throw 'either `id` or `name` is required'
            },
        })
    }
})

export const UserMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('setAbout', {
            type: User,
            args: {
                about: stringArg(),
            },
            resolve(parent, args, ctx, info) {
                return userSvc.setAbout({
                    signedInUser: ctx.signedInUser, about: args.about ?? null,
                })
            }
        })
    }
})