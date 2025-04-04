import { enumType, list, nonNull, objectType, extendType, idArg, stringArg } from "nexus";
import { Reply } from "./Reply";
import { Node } from "./Node";

const ReplyType = enumType({
    name: 'ReplyType',
    members: ['ALL', 'LINKS', 'REPLIES'],
})

export const User = objectType({
    name: 'User',
    definition(t) {
        t.implements(Node)
        // TODO: use relay connection
        t.field('replies', {
            type: list(Reply),
            description: 'Replies by the `User`',
            args: {
                type: nonNull(ReplyType),
            },
        })
        t.string('name', {
            description: '`User` name',
        })
        t.string('about', {
            description: '`User` bio, describing themselves'
        })
        t.string('createdAt', {
            description: '`User` creation time'
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
                // TODO: add to svc later
                return null
            },
        })
    }
})