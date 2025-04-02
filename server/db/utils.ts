import { sql } from "drizzle-orm";
import { pgTableCreator, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ba_gql_demo_${name}`);

export const createdAtMixin = {
  createdAt: timestamp('created_at', { withTimezone: true }).
    default(sql`CURRENT_TIMESTAMP`).
    notNull(),
}

export const updatedAtMixin = {
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
}

export const idMixin = {
  id: text('id').
    notNull().
    primaryKey().
    $defaultFn(() => nanoid(5)),
}