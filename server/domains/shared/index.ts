export type Reply = {
    id: string;
    isLink: boolean;
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

import { db } from '@/db';
import { users } from '@/db/schema';
import { hash, compare } from 'bcryptjs'
import { eq } from 'drizzle-orm';

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

export async function getServerAuthSession(token: string):
    Promise<{ success: false; message: string } | { success: true; user: User; }> {

    // TODO: token is just the user ID right now, make sure that it's an actual JWT later.
    const user = await db.query.users.findFirst({
        where: eq(users.id, token),
    })

    if (!user)
        return { success: false, message: 'user not found' }
    else return { success: true, user }
}