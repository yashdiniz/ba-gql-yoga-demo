import { db } from "@/db";
import { replies, users, votes } from "@/db/schema";
import { and, desc, DrizzleError, eq, lt } from "drizzle-orm";
import { derror, jwtSign, saltAndHashPassword, USERNAME_REGEX, verifyHashes, type Cursor, type Reply, type User } from "../shared";

export type UserOutput = User

type UserByIdQueryInput = {
    id: string;
}
type UserByNameQueryInput = {
    name: string;
}
type LoginInput = {
    name: string;
    password: string;
}
type LoginOutput = {
    user: User;
    token: string;
}
type UserRepliesQueryInput = {
    first: number;
    after: Cursor<number> | null;
    userId: string;
    signedInUser: User;
    replyType: 'LINKS_REPLIES' | 'LINKS' | 'REPLIES' | 'VOTED';
}
type CreateUserMutationInput = {
    name: string;
    password: string;
    // TODO: captcha implementation
}
type SetAboutMutationInput = {
    signedInUser: User;
    about: string | null;
}
type SetPasswordMutationInput = {
    signedInUser: User;
    newPassword: string;
    oldPassword: string;
}
export interface UserService {
    getUserById(input: UserByIdQueryInput): Promise<UserOutput>;
    getUserByName(input: UserByNameQueryInput): Promise<UserOutput>;
    getUserReplies(input: UserRepliesQueryInput): Promise<Reply[]>;
    userExists(input: UserByNameQueryInput): Promise<boolean>;
    login(input: LoginInput): Promise<LoginOutput>;

    setPassword(input: SetPasswordMutationInput): Promise<void>;
    setAbout(input: SetAboutMutationInput): Promise<UserOutput>;
    createUser(input: CreateUserMutationInput): Promise<UserOutput>;
}

export function newUserService(): UserService {
    return new UserSvc();
}

class UserSvc implements UserService {
    async getUserById(input: UserByIdQueryInput) {
        const { id } = input
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
        }).execute().catch(e => {
            console.error('UserSvc.getUserById', e)
            throw derror(500, e)
        })

        if (user)
            return {
                ...user,
                password: undefined,
            }
        else throw derror(404, 'user not found')
    }

    async getUserByName(input: UserByNameQueryInput) {
        const { name } = input
        const user = await db.query.users.findFirst({
            where: eq(users.name, name),
        }).execute().catch(e => {
            console.error('UserSvc.getUserByName', e)
            throw derror(500, e)
        })

        if (user)
            return {
                ...user,
                password: undefined,
            }
        else throw derror(404, 'user not found')
    }

    async getUserReplies(input: UserRepliesQueryInput) {
        const { first, after, userId, signedInUser, replyType } = input

        let res;
        if (replyType !== 'VOTED') {
            let replyTypeQuery;
            switch (replyType) {
                case 'LINKS_REPLIES':
                    replyTypeQuery = undefined
                    break
                default:
                    replyTypeQuery = eq(replies.isLink, replyType === 'LINKS')

            }
            res = await db.query.replies.findMany({
                where: and(
                    eq(replies.authorId, userId),
                    replyTypeQuery,
                    after ? lt(replies.id, after.i) : undefined, // PAGINATION
                ),
                with: {
                    votes: {
                        where: eq(votes.userId, signedInUser.id)
                    }
                },
                limit: first,
                orderBy: desc(replies.id), // PAGINATION
            }).execute().catch(e => {
                console.error('UserSvc.getUserReplies', e)
                throw derror(500, e)
            })
            const result = res.map(reply => ({
                ...reply,
                hasVoted: reply.votes.length > 0,
            }))
            return result
        } else {
            res = await db.query.votes.findMany({
                where: and(
                    eq(votes.userId, userId),
                    after ? lt(votes.createdAt, new Date(after.v)) : undefined, // PAGINATION
                ),
                with: {
                    reply: {
                        with: {
                            votes: {
                                where: eq(votes.userId, signedInUser.id),
                            }
                        }
                    },
                },
                limit: first,
                orderBy: desc(votes.createdAt), // PAGINATION
            }).execute().catch(e => {
                console.error('UserSvc.getUserReplies', e)
                throw derror(500, e)
            })
            const result = res.map(({ reply }) => ({
                ...reply,
                hasVoted: reply.votes.length > 0,
            }))
            return result
        }
    }

    async userExists(input: UserByNameQueryInput) {
        const { name } = input
        const user = await db.query.users.findFirst({
            columns: { id: true },
            where: eq(users.name, name),
        }).execute().catch(e => {
            console.error('UserSvc.userExists', e)
            throw derror(500, e)
        })

        return !!user
    }

    async login(input: LoginInput) {
        const { name, password } = input
        const user = await db.query.users.findFirst({
            where: eq(users.name, name),
        }).execute().catch(e => {
            console.error('UserSvc.login', e)
            throw derror(500, e)
        })

        if (user && await verifyHashes(user.password, password)) {
            return {
                user: {
                    ...user,
                    password: undefined, // mask password
                },
                token: jwtSign(user.id),
            }
        } else throw derror(401, 'password incorrect or user does not exist')
    }

    async setPassword(input: SetPasswordMutationInput) {
        const { signedInUser, oldPassword, newPassword } = input

        const user = await db.query.users.findFirst({
            where: eq(users.id, signedInUser.id),
        }).execute().catch(e => {
            console.error('UserSvc.setPassword', e)
            throw derror(500, e)
        })

        if (user && await verifyHashes(user.password, oldPassword)) {
            await db.update(users).set({
                password: await saltAndHashPassword(newPassword),
            }).
                where(eq(users.id, user.id)).
                execute().catch(e => {
                    console.error('UserSvc.setPassword', e)
                    throw derror(500, e)
                })
        } else throw derror(401, 'old password incorrect or user does not exist')
    }

    async setAbout(input: SetAboutMutationInput) {
        const { signedInUser, about } = input

        const user = await db.update(users).set({ about, }).
            where(eq(users.id, signedInUser.id)).
            returning().
            execute().catch(e => {
                console.error('UserSvc.setAbout', e)
                throw derror(500, e)
            })

        return {
            ...user[0],
            password: undefined, // mask password
        }
    }

    async createUser(input: CreateUserMutationInput) {
        const { name, password } = input

        if (!name.match(USERNAME_REGEX)) {
            throw derror(403, 'username must be alphanumeric lower case')
        }

        const user = await db.insert(users).values({
            name,
            password: await saltAndHashPassword(password),
        }).
            returning().
            execute().catch((e: DrizzleError) => {
                console.error('UserSvc.createUser', e)
                //@ts-ignore
                if (e.code == 'SQLITE_CONSTRAINT_UNIQUE')
                    throw derror(403, 'user already exists')
                throw derror(500, e)
            })

        return {
            ...user[0],
            password: undefined, // mask password
            token: jwtSign(user[0].id),
        }
    }
}