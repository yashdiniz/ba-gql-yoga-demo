import { integer, primaryKey, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createTable, idMixin, createdAtMixin, updatedAtMixin } from "./utils";
import { relations, sql, type InferSelectModel } from "drizzle-orm";

export const users = createTable(
    'user',
    {
        ...idMixin('u'),
        name: text('name').
            notNull(),
        password: text('password').
            notNull(),
        about: text('about'),
        ...createdAtMixin, ...updatedAtMixin,
    },
    user => [
        uniqueIndex('user_name_idx').on(sql`lower(${user.name})`), // case insensitive index on username
    ],
)

export type User = InferSelectModel<typeof users>

export const userRelations = relations(users, ({ many }) => ({
    replies: many(replies, {
        relationName: 'author',
    }),
    votes: many(votes, {
        relationName: 'user',
    }),
}))

export const replies = createTable(
    'reply',
    {
        ...idMixin('r'),
        rootId: text('root_id'),
        parentId: text('parent_id'),
        authorId: text('author_id').
            notNull().references(() => users.id, { onDelete: 'cascade' }),
        title: text('title').
            notNull(),
        content: text('content'),
        isLink: integer('is_link', { mode: 'boolean', }).
            notNull().
            generatedAlwaysAs(sql`"root_id" IS NULL`),
        isDeleted: integer('is_deleted', { mode: 'boolean', }).
            notNull().
            default(false),
        ...createdAtMixin, ...updatedAtMixin,
    },
)

export type Reply = InferSelectModel<typeof replies>

export const repliesRelations = relations(replies, ({ one, many }) => ({
    parent: one(replies, {
        fields: [replies.parentId],
        references: [replies.id],
    }),
    root: one(replies, {
        fields: [replies.rootId],
        references: [replies.id],
    }),
    author: one(users, {
        relationName: 'author',
        fields: [replies.authorId],
        references: [users.id],
    }),
    votes: many(votes, {
        relationName: 'reply',
    }),
}))

export const votes = createTable(
    'vote',
    {
        userId: text('user_id').
            notNull().
            references(() => users.id),
        replyId: text('reply_id').
            notNull().
            references(() => replies.id),
        ...createdAtMixin,
    },
    vote => [
        primaryKey({ columns: [vote.userId, vote.replyId] }),
    ],
)

export type Vote = InferSelectModel<typeof votes>

export const voteRelations = relations(votes, ({ one }) => ({
    user: one(users, {
        relationName: 'user',
        fields: [votes.userId],
        references: [users.id],
    }),
    reply: one(replies, {
        relationName: 'reply',
        fields: [votes.replyId],
        references: [replies.id],
    }),
}))