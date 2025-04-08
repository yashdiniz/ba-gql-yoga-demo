import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createYoga } from 'graphql-yoga'
import { schema } from '@/schema/index.js'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { users } from '@/db/schema'

const app = new Hono()

const yoga = createYoga({
  schema,
  graphiql: true,
  graphqlEndpoint: '/gql',
  landingPage: false,
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use('/gql', async (c) => {
  // TODO: implement jwt authorization
  // current workaround is adding user id to request header
  const userId = c.req.header('Authorization')
  const guest = {
    id: '0',
    name: 'guest',
    password: '',
    createdAt: new Date(),
  }

  const signedInUser = (userId ?
    await db.query.users.findFirst({
      where: eq(users.id, userId),
    }) : guest) ?? guest

  // @ts-ignore
  return yoga.handle(c.req.raw, {
    signedInUser,
  })
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
