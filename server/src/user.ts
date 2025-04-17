import { newUserService } from '@/domains/user';
import { getServerAuthSession, type User } from '../domains/shared'
import { Hono } from "hono";
import { HTTPException } from 'hono/http-exception'

type Variables = {
    signedInUser: User;
}
export const userRouter = new Hono<{
    Variables: Variables;
}>()

const userSvc = newUserService();

// get user by id
userRouter.get('/i/:id', async c => {
    const { id } = c.req.param()
    try {
        return c.json(await userSvc.getUserById({ id }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// get user by name
userRouter.get('/n/:name', async c => {
    const { name } = c.req.param()
    try {
        return c.json(await userSvc.getUserByName({ name }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// check if user exists
userRouter.get('/exists/:name', async c => {
    const { name } = c.req.param()
    try {
        return c.json(await userSvc.userExists({ name }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// login user
userRouter.post('/login', async c => {
    const { name, password } = await c.req.json<{
        name: string; password: string;
    }>()
    try {
        return c.json(await userSvc.login({ name, password }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

userRouter.post('/create', async c => {
    const { name, password } = await c.req.json<{
        name: string; password: string;
    }>()
    try {
        return c.json(await userSvc.createUser({ name, password }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

userRouter.use(async (c, next) => {
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

// get replies for user profile
userRouter.get('/replies', async c => {
    const signedInUser = c.get('signedInUser')
    //@ts-ignore
    const { first, after, userid, type }: {
        first?: number;
        after?: string;
        userid: string;
        type: 'LINKS_REPLIES' | 'LINKS' | 'REPLIES' | 'VOTED';
    } = c.req.param()
    try {
        return c.json(await userSvc.getUserReplies({
            first: first ?? 20,
            after: after ? {
                // TODO: parseInt could return NaN
                i: after, v: new Date(parseInt(after)).getTime(),
            } : null,
            userId: userid,
            replyType: type,
            signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// set password
userRouter.put('/password', async c => {
    const signedInUser = c.get('signedInUser')
    const { oldPassword, newPassword } = await c.req.json<{
        oldPassword: string; newPassword: string;
    }>()
    try {
        await userSvc.setPassword({ signedInUser, oldPassword, newPassword })
        return c.json(true)
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// set about
userRouter.put('/about', async c => {
    const signedInUser = c.get('signedInUser')
    const { about } = await c.req.json<{
        about: string;
    }>()
    try {
        return c.json(await userSvc.setAbout({ signedInUser, about }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})