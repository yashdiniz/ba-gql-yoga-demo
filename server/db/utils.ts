import { sql } from "drizzle-orm";
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `ba_gql_demo_${name}`);

export const createdAtMixin = {
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).
    default(new Date()).
    notNull(),
}

export const updatedAtMixin = {
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$onUpdate(() => new Date()),
}

export const idMixin = (prefix: string) => ({
  id: text('id').
    notNull().
    primaryKey().
    $defaultFn(() => mnano(prefix)),
})

function mnano(prefix: string, size?: number) {
  if (prefix.length !== 1) throw 'prefix must be 1 character'
  if (size === undefined) size = 5
  return prefix + nanoid(size)
}