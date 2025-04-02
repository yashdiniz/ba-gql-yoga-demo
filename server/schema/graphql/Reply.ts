import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Node } from "./Node";
import { User } from "./User";

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
            description: 'Author of the `Reply`'
        })
        t.string('title', {
            description: 'Title of `Reply`'
        })
        t.string('url', {
            description: 'URL of the `Reply`'
        })
        t.string('content', {
            description: 'Content of the `Reply`'
        })
        t.nonNull.boolean('isLink', {
            description: 'Is the `Reply` a link?'
        })
        t.nonNull.string('createdAt', {
            description: 'Creation time of the `Reply`'
        })
        t.nonNull.int('votes', {
            description: 'Number of votes on the `Reply`'
        })
    },
})

export const ReplyQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('feed', {
            type: Reply,
            description: 'Get all replies in the feed',
            resolve(parent, args, context, info) {
                // TODO: move to svc later
                return [{id: 'd', title: '', url: ''}]
            },
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
            },
            resolve(parent, args, context) {
                // TODO: move to svc later
                const {url, title} = args
                return {id: 'd', title, url}
            }
        })
    },
})