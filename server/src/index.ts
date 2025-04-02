import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createYoga } from 'graphql-yoga'
import { schema } from '@/schema/index.js'

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
  // @ts-ignore
  return yoga.handle(c.req.raw, {})
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
