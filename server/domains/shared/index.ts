import 'dotenv/config'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { db } from '@/db';
import { users } from '@/db/schema';
import { hash, compare } from 'bcryptjs'
import { eq } from 'drizzle-orm';
import env from '@/env';

const { sign, verify, TokenExpiredError } = jwt

export const USERNAME_REGEX = /^[0-9a-z_][0-9a-z_.]{1,16}$/

export type Reply = {
    id: string;
    type: 'LINK' | 'REPLY';
    createdAt: Date;
    rootId: string | null;
    parentId: string | null;
    authorId: string;
    hasVoted: boolean;
    title: string;
    content: string | null;
}

export type User = {
    id: string;
    name: string;
    about: string | null;
    createdAt: Date;
}

export type DError = {
    statusCode: number;
    name?: string;
    message: string;
    cause?: unknown;
}

export function derror(statusCode: number, e: string | Error): DError {
    if (typeof e === 'string') {
        return {
            statusCode,
            message: e,
        }
    }
    return {
        statusCode,
        message: e.message, name: e.name,
        cause: e.cause,
    }
}

export type Cursor<CursorType> = {
    i: string;
    v: CursorType;
}

/**
 * Generates a hash & salt from plaintext `password`.
 * Uses the salt from hashed for the verification.
 * */
export async function saltAndHashPassword(password: string) {
    return await hash(password, 12)
}

/**
 * Compares `hashed` to plaintext `password`.
 * Uses the salt from hashed for the verification.
 * */
export async function verifyHashes(hashed: string, password: string) {
    return await compare(password, hashed)
}

/**
 * Custom Server auth function to get session details
 * */
export async function getServerAuthSession(req: Request):
    Promise<{ success: false; message: string } | { success: true; user: User; }> {
    // split the authorization header by space delim to get the jwt
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
        return { success: false, message: "invalid authorization token" }
    }
    const a = authHeader.split(" ")
    const token = a[0] && a[0].toLowerCase() == "bearer" ? a[1] : a[0]
    if (!token) {
        return { success: false, message: "invalid authorization token" }
    }

    return getServerAuthSessionFromToken(token)
}

/**
 * Wrapper for JWT sign with payload type checking
 * */
export function jwtSign(payload: string) {
    return sign({ id: payload }, env.JWT_KEY!, {
        algorithm: "HS256",
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
        subject: payload,
        expiresIn: "1h",
    })
}

/**
 * Wrapper for JWT verify
 * */
export function jwtVerify(token: string) {
    try {
        return verify(token, env.JWT_KEY!, {
            algorithms: ["HS256"],
            issuer: env.JWT_ISSUER,
            audience: env.JWT_AUDIENCE,
        })
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            return { success: false, message: "token expired" }
        } else {
            return { success: false, message: "invalid token" }
        }
    }
}

const Payload = z.object({
    id: z.string(),
    sub: z.string(),
})

/**
 * Custom Server auth function to get session details
 * specialCase: if true, will return the user profile info even if the user is disabled
 * */
export async function getServerAuthSessionFromToken(token: string):
    Promise<{ success: false; message: string } | { success: true; user: User }> {
    // verify the JWT and parse it into the valid format
    const payload = Payload.safeParse(jwtVerify(token))
    if (!payload.success) {
        return { success: false, message: "invalid authorization token or expired" }
    }

    // find the user and profile info for that token
    const user = await db.query.users.findFirst({
        where: eq(users.id, payload.data.sub),
    }).execute()
    if (!user || user.password === "") { // password is "" if the user is anonymised after deleting their account
        return { success: false, message: "user not found" }
    }

    return { success: true, user }
}