import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createYoga } from 'graphql-yoga'
import { schema } from '@/schema/index.js'
import { getServerAuthSession, type User } from '@/domains/shared'
import { userRouter } from './user'
import { HTTPException } from 'hono/http-exception'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

type Variables = {
  signedInUser: User;
}
const app = new Hono<{
  Variables: Variables;
}>()

const yoga = createYoga({
  schema,
  graphiql: true,
  graphqlEndpoint: '/gql',
  landingPage: false,
})

app.use(logger())
app.use('*', cors({
  origin: ['http://localhost:5173'], // TODO: CHANGE THIS ACCORDINGLY
  credentials: true,
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/user', userRouter)

app.use(async (c, next) => {
  // const guest: User = {
  //   id: '0',
  //   name: 'guest',
  //   createdAt: new Date(),
  //   about: null,
  // }

  const d = await getServerAuthSession(c.req.raw)
  if (d.success) c.set('signedInUser', d.user)
  else throw new HTTPException(401, { message: d.message })

  return await next()
})

app.use('/gql', async (c) => {
  // @ts-ignore
  return yoga.handle(c.req.raw, {
    signedInUser: c.get('signedInUser'),
  })
})


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
