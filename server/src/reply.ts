import { newReplyService } from "@/domains/reply";
import { getServerAuthSession, type User } from "@/domains/shared";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

type Variables = {
    signedInUser: User;
}
export const replyRouter = new Hono<{
    Variables: Variables;
}>()

const replySvc = newReplyService()

replyRouter.use(async (c, next) => {
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

// get feed
replyRouter.get('/feed', async c => {
    const signedInUser = c.get('signedInUser')
    const { first, after }: {
        first?: number;
        after?: string;
    } = c.req.query()
    try {
        return c.json(await replySvc.feed({
            first: first ?? 10,
            after: after ? {
                i: after, v: 0,
            } : null,
            signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// get reply
replyRouter.get('/:id', async c => {
    const signedInUser = c.get('signedInUser')
    const { id } = c.req.param()
    try {
        return c.json(await replySvc.reply({
            id, signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// get replies of Root
replyRouter.get('/all/:id', async c => {
    const signedInUser = c.get('signedInUser')
    const { id } = c.req.param()
    try {
        return c.json(await replySvc.repliesOfRoot({
            id, signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// get root of reply
replyRouter.get('/root/:id', async c => {
    const signedInUser = c.get('signedInUser')
    const { id } = c.req.param()
    try {
        return c.json(await replySvc.rootOfReply({
            id, signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// get parent of reply
replyRouter.get('/parent/:id', async c => {
    const signedInUser = c.get('signedInUser')
    const { id } = c.req.param()
    try {
        return c.json(await replySvc.parentOfReply({
            id, signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// get author of reply
replyRouter.get('/author/:id', async c => {
    const signedInUser = c.get('signedInUser')
    const { id } = c.req.param()
    try {
        return c.json(await replySvc.authorOfReply({
            id, signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// vote count of reply
replyRouter.get('/voteCount/:id', async c => {
    const signedInUser = c.get('signedInUser')
    const { id } = c.req.param()
    try {
        return c.json(await replySvc.voteCountOfReply({
            id, signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// make post
replyRouter.post('/publish', async c => {
    const signedInUser = c.get('signedInUser')
    const { title, content } = await c.req.json<{
        title: string; content?: string;
    }>()
    try {
        return c.json(await replySvc.makePost({
            title, content: !content ? null : content,
            signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// make reply
replyRouter.post('/', async c => {
    const signedInUser = c.get('signedInUser')
    const { parentid, content } = await c.req.json<{
        parentid: string; content: string;
    }>()
    try {
        return c.json(await replySvc.makeReply({
            parentId: parentid, content,
            signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// delete reply
replyRouter.delete('/:id', async c => {
    const signedInUser = c.get('signedInUser')
    const { id } = c.req.param()
    try {
        return c.json(await replySvc.deleteReply({
            replyId: id, signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})

// vote on reply
replyRouter.put('/vote', async c => {
    const signedInUser = c.get('signedInUser')
    const { id, type } = await c.req.json<{
        id: string; type: 'UP' | 'NO';
    }>()
    try {
        return c.json(await replySvc.voteOnReply({
            replyId: id, type, signedInUser,
        }))
    } catch (e: any) {
        throw new HTTPException(e.statusCode, { message: e.message })
    }
})