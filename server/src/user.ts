import { newUserService } from '@/domains/user';
import { getServerAuthSession, type User } from '../domains/shared'
import { Hono } from "hono";

type Variables = {
    signedInUser: User;
}
export const userRouter = new Hono<{
    Variables: Variables;
}>()

const userSvc = newUserService();

userRouter.use(async (c, next) => {
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

// get user by id
userRouter.get('/:id', async c => {
    const { id } = c.req.param()
    return c.json(userSvc.getUserById({ id }))
})

// get user by name
userRouter.get('/:name', async c => {
    const { name } = c.req.param()
    return c.json(userSvc.getUserByName({ name }))
})

// check if user exists
userRouter.get('/exists/:name', async c => {
    const { name } = c.req.param()
    return c.json(userSvc.userExists({ name }))
})

// login user
userRouter.post('/login', async c => {
    const { name, password } = await c.req.parseBody<{
        name: string; password: string;
    }>()
    return c.json(userSvc.login({ name, password }))
})

// set password
userRouter.post('/password', async c => {
    const signedInUser = c.get('signedInUser')
    const { oldPassword, newPassword } = await c.req.parseBody<{
        oldPassword: string; newPassword: string;
    }>()
    return c.json(userSvc.setPassword({ signedInUser, oldPassword, newPassword }))
})

// set about
userRouter.post('/about', async c => {
    const signedInUser = c.get('signedInUser')
    const { about } = await c.req.parseBody<{
        about: string;
    }>()
    return c.json(userSvc.setAbout({ signedInUser, about }))
})

userRouter.post('/create', async c => {
    const { name, password } = await c.req.parseBody<{
        name: string; password: string;
    }>()
    return c.json(userSvc.createUser({ name, password }))
})