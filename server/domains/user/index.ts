import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { saltAndHashPassword, verifyHashes, type User } from "../shared";

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
            throw e
        })

        if (user)
            return user
        else throw 'user not found'
    }

    async getUserByName(input: UserByNameQueryInput) {
        const { name } = input
        const user = await db.query.users.findFirst({
            where: eq(users.name, name),
        }).execute().catch(e => {
            console.error('UserSvc.getUserByName', e)
            throw e
        })

        if (user)
            return user
        else throw 'user not found'
    }

    async userExists(input: UserByNameQueryInput) {
        const { name } = input
        const user = await db.query.users.findFirst({
            columns: { id: true },
            where: eq(users.name, name),
        }).execute().catch(e => {
            console.error('UserSvc.userExists', e)
            throw e
        })

        return !!user
    }

    async login(input: LoginInput) {
        const { name, password } = input
        const user = await db.query.users.findFirst({
            where: eq(users.name, name),
        }).execute().catch(e => {
            console.error('UserSvc.login', e)
            throw e
        })

        if (user && await verifyHashes(user.password, password)) {
            return {
                user,
                token: user.id,
            }
        } else throw 'password incorrect or user does not exist'
    }

    async setPassword(input: SetPasswordMutationInput) {
        const { signedInUser, oldPassword, newPassword } = input

        const user = await db.query.users.findFirst({
            where: eq(users.id, signedInUser.id),
        }).execute().catch(e => {
            console.error('UserSvc.setPassword', e)
            throw e
        })

        if (user && await verifyHashes(user.password, oldPassword)) {
            await db.update(users).set({
                password: await saltAndHashPassword(newPassword),
            }).
                where(eq(users.id, user.id)).
                execute().catch(e => {
                    console.error('UserSvc.setPassword', e)
                    throw e
                })
        } else throw 'old password incorrect or user does not exist'
    }

    async setAbout(input: SetAboutMutationInput) {
        const { signedInUser, about } = input

        const user = await db.update(users).set({ about, }).
            where(eq(users.id, signedInUser.id)).
            returning().
            execute().catch(e => {
                console.error('UserSvc.setPassword', e)
                throw e
            })

        return user[0]
    }

    async createUser(input: CreateUserMutationInput) {
        const { name, password } = input

        const user = await db.insert(users).values({
            name,
            password: await saltAndHashPassword(password),
        }).
            returning().
            execute().catch(e => {
                console.error('UserSvc.createUser', e)
                throw e
            })

        return user[0]
    }
}