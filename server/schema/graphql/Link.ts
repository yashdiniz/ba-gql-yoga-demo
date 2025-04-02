import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Node } from "./Node";
import type { NexusGenObjects } from "@/generated/nexus-typegen";
import { nanoid } from "nanoid";

export const Link = objectType({
    name: 'Link',
    definition(t) {
        t.implements(Node)
        t.nonNull.string('title', {
            description: 'Title of `Link` resource'
        })
        t.nonNull.string('url', {
            description: 'URL of the `Link` resource'
        })
    },
})

let links: NexusGenObjects['Link'][]= [
    {
        id: nanoid(5),
        url: 'www.howtographql.com',
        title: 'Fullstack tutorial for GraphQL',
    },
    {
        id: nanoid(5),
        url: 'graphql.org',
        title: 'GraphQL official website',
    },
];

export const LinkQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('feed', {
            type: Link,
            description: 'Get all `Link`s in the feed',
            resolve(parent, args, context, info) {
                return links;
            },
        });
    },
});

export const LinkMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('post', {
            type: Link,
            description: 'Post a `Link` to the feed',
            args: {
                url: nonNull(stringArg()),
                title: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                // TODO: move to svc later
                const {url, title} = args

                const link: NexusGenObjects['Link'] = {
                    id: nanoid(5), url, title,
                }
                links.push(link)
                return link
            }
        })
    },
})