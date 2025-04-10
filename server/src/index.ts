import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createYoga } from 'graphql-yoga'
import { schema } from '@/schema/index.js'
import { getServerAuthSession, type User } from '@/domains/shared'
import { userRouter } from './user'

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

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use(async (c, next) => {
  // TODO: implement jwt authorization
  // current workaround is adding user id to request header
  const userId = c.req.header('Authorization')
  const guest: User = {
    id: '0',
    name: 'guest',
    createdAt: new Date(),
    about: null,
  }

  let signedInUser = guest;
  if (userId) {
    const d = await getServerAuthSession(userId)
    if (d.success) signedInUser = d.user
    else throw d.message
  }

  c.set('signedInUser', signedInUser)
  await next()
})

app.use('/gql', async (c) => {
  // @ts-ignore
  return yoga.handle(c.req.raw, {
    signedInUser: c.get('signedInUser'),
  })
})

app.route('/user', userRouter)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
