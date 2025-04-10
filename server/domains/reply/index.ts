import { db } from "@/db";
import { replies, votes } from "@/db/schema";
import { and, count, eq } from "drizzle-orm";
import type { Reply, User } from "../shared";

export type ReplyOutput = Reply

type Cursor<CursorType> = {
    i: string;
    v: CursorType;
}

export interface ReplyService {
    feed(input: FeedQueryInput): Promise<ReplyOutput[]>;
    reply(input: ReplyQueryInput): Promise<ReplyOutput>;
    repliesOfRoot(input: ReplyQueryInput): Promise<ReplyOutput[]>;
    rootOfReply(input: ReplyQueryInput): Promise<ReplyOutput | null>;
    parentOfReply(input: ReplyQueryInput): Promise<ReplyOutput | null>;
    authorOfReply(input: ReplyQueryInput): Promise<User>;
    voteCountOfReply(input: ReplyQueryInput): Promise<number>;

    makePost(input: PostMutationInput): Promise<ReplyOutput>;
    makeReply(input: ReplyMutationInput): Promise<ReplyOutput>;
    deleteReply(input: DeleteReplyMutationInput): Promise<boolean>;
    voteOnReply(input: VoteMutationInput): Promise<boolean>;
}

export function newReplyService(): ReplyService {
    return new ReplySvc();
}

type FeedQueryInput = {
    first: number;
    after: Cursor<number> | null;
    signedInUser: User;
}

type ReplyQueryInput = {
    id: string;
    signedInUser: User;
}

type PostMutationInput = {
    title: string;
    content: string | null;
    signedInUser: User;
}

type ReplyMutationInput = {
    parentId: string;
    content: string;
    signedInUser: User;
}

type VoteMutationInput = {
    replyId: string;
    type: 'UP' | 'NO';
    signedInUser: User;
}

type DeleteReplyMutationInput = {
    replyId: string;
    signedInUser: User;
}

class ReplySvc implements ReplyService {
    async rootOfReply(input: ReplyQueryInput) {
        const { id, signedInUser } = input
        const replyResult = await db.query.replies.findFirst({
            where: eq(replies.id, id),
            columns: {}, // no columns required from this reply
            with: {
                root: {  // get all columns of root reply
                    with: {
                        votes: { // along with hasVoted check
                            where: eq(votes.userId, signedInUser.id)
                        }
                    }
                },
            }
        }).execute().catch(e => {
            console.error('ReplySvc.rootOfReply', e)
            throw e
        })

        if (replyResult && replyResult.root)
            return {
                ...replyResult.root,
                hasVoted: replyResult.root.votes?.length > 0,
                // NOTE: if the reply is deleted, return `title` and `content` as deleted.
                title: replyResult.root.isDeleted ? '[deleted]' : replyResult.root.title,
                content: replyResult.root.isDeleted ? '[deleted]' : replyResult.root.content,
            }
        else return null
    }

    async parentOfReply(input: ReplyQueryInput) {
        const { id, signedInUser } = input
        const replyResult = await db.query.replies.findFirst({
            where: eq(replies.id, id),
            columns: {}, // no columns required from this reply
            with: {
                parent: {  // get all columns of parent reply
                    with: {
                        votes: { // along with hasVoted check
                            where: eq(votes.userId, signedInUser.id)
                        }
                    }
                },
            }
        }).execute().catch(e => {
            console.error('ReplySvc.parentOfReply', e)
            throw e
        })

        if (replyResult && replyResult.parent)
            return {
                ...replyResult.parent,
                hasVoted: replyResult.parent.votes?.length > 0,
                // NOTE: if the reply is deleted, return `title` and `content` as deleted.
                title: replyResult.parent.isDeleted ? '[deleted]' : replyResult.parent.title,
                content: replyResult.parent.isDeleted ? '[deleted]' : replyResult.parent.content,
            }
        else return null
    }

    async reply(input: ReplyQueryInput): Promise<ReplyOutput> {
        const { id, signedInUser } = input
        const replyResult = await db.query.replies.findFirst({
            where: eq(replies.id, id),
            with: {
                votes: {
                    where: eq(votes.userId, signedInUser.id),
                },
            }
        }).execute().catch(e => {
            console.error('ReplySvc.reply', e)
            throw e
        })

        if (replyResult)
            return {
                ...replyResult,
                hasVoted: replyResult.votes?.length > 0,
                // NOTE: if the reply is deleted, return `title` and `content` as deleted.
                title: replyResult.isDeleted ? '[deleted]' : replyResult.title,
                content: replyResult.isDeleted ? '[deleted]' : replyResult.content,
            }
        else throw 'reply not found'
    }

    async feed(input: FeedQueryInput) {
        const { first, after, signedInUser } = input
        const results = await db.query.replies.findMany({
            where: and(
                eq(replies.isDeleted, false), // do not return deleted root replies (Links)
                eq(replies.isLink, true),
            ),
            with: {
                votes: {
                    where: eq(votes.userId, signedInUser.id)
                }
            },
            limit: first,
            offset: after?.v, // TODO: fix the pagination here
        }).execute().catch(e => {
            console.error('ReplySvc.feed', e)
            throw e
        })
        if (results.length === 0) {
            console.error('ReplySvc.feed:', '0 items in results')
            return []
        }

        const res = results.map(p => ({
            ...p,
            hasVoted: p.votes.length > 0,
        }))

        return res
    }

    async repliesOfRoot(input: ReplyQueryInput) {
        const { id, signedInUser } = input
        // NOTE: due to nested structure of replies, ALLOW replies of posts EVEN IF DELETED
        // do not want the frontend to panic because of missing reply nodes when building tree
        const results = await db.query.replies.findMany({
            where: and(
                eq(replies.rootId, id),
            ),
            with: {
                votes: {
                    where: eq(votes.userId, signedInUser.id)
                }
            }
        }).execute().catch(e => {
            console.error('ReplySvc.repliesOfRoot', e)
            throw e
        })

        const res = results.map(p => ({
            ...p,
            // NOTE: if the reply is deleted, return `title` and `content` as deleted.
            title: p.isDeleted ? '[deleted]' : p.title,
            content: p.isDeleted ? '[deleted]' : p.content,
            hasVoted: p.votes.length > 0,
        }))

        // TODO: SORT BY TREE 

        return res
    }

    async authorOfReply(input: ReplyQueryInput) {
        const { id } = input
        const result = await db.query.replies.findFirst({
            where: and(
                eq(replies.id, id),
            ),
            with: {
                author: true,
            }
        }).execute().catch(e => {
            console.error('ReplySvc.authorOfReply', e)
            throw e
        })

        if (result)
            return result.isDeleted ? {
                ...result.author,
                id: '0',
                name: '[deleted]',
                about: null,
                createdAt: new Date(), updatedAt: null,
            } : result.author
        else throw 'could not fetch author'
    }

    async voteCountOfReply(input: ReplyQueryInput) {
        const { id } = input
        // TODO: return 0 on posts with isDeleted true 
        const result = await db.select({
            voteCount: count(votes.userId),
        }).
            from(votes).
            where(eq(votes.replyId, id)).
            groupBy(votes.replyId).
            limit(1).
            execute().catch(e => {
                console.error('ReplySvc.voteCountOfReply', e)
                throw e
            })

        return result[0].voteCount
    }

    async makePost(input: PostMutationInput) {
        const { signedInUser, title, content } = input

        const res = await db.insert(replies).values({
            authorId: signedInUser.id,
            title, content,
        }).
            returning().
            execute().catch(e => {
                console.error('ReplySvc.makePost', e)
                throw e
            })

        return {
            ...res[0],
            hasVoted: false,
        }
    }

    async makeReply(input: ReplyMutationInput) {
        const { signedInUser, content, parentId } = input

        const parentReply = await db.query.replies.findFirst({
            where: eq(replies.id, parentId)
        }).execute().catch(e => {
            console.error('ReplySvc.makeReply', e)
            throw e
        })
        if (!parentReply) {
            throw 'parent reply not found'
        }

        const res = await db.insert(replies).values({
            authorId: signedInUser.id,
            title: content,
            parentId: parentReply.id,
            rootId: parentReply.rootId,
        }).
            returning().
            execute().catch(e => {
                console.error('ReplySvc.makePost', e)
                throw e
            })

        return {
            ...res[0],
            hasVoted: false,
        }
    }

    async voteOnReply(input: VoteMutationInput) {
        const { replyId, signedInUser, type } = input

        // TODO: prevent votes on replies with isDeleted flag true

        const vote = await db.query.votes.findFirst({
            where: and(
                eq(votes.replyId, replyId),
                eq(votes.userId, signedInUser.id),
            )
        }).execute().catch(e => {
            console.error('ReplySvc.voteOnReply', e)
            throw e
        })

        if (type === 'NO' && vote) {
            await db.delete(votes).
                where(
                    and(
                        eq(votes.replyId, replyId),
                        eq(votes.userId, signedInUser.id),
                    )
                ).execute().catch(e => {
                    console.error('ReplySvc.voteOnReply', e)
                    throw e
                })
        } else if (type === 'UP' && !vote) {
            await db.insert(votes).
                values({
                    replyId, userId: signedInUser.id,
                }).execute().catch(e => {
                    console.error('ReplySvc.voteOnReply', e)
                    throw e
                })
        } else return false

        return true
    }

    async deleteReply(input: DeleteReplyMutationInput) {
        const { replyId, signedInUser } = input

        await db.update(replies).
            set({
                isDeleted: true,
            }).
            where(and(
                eq(replies.id, replyId),
                eq(replies.authorId, signedInUser.id), // prevent deleting reply if not made by user
            )).
            execute().catch(e => {
                console.error('ReplySvc.deleteReply', e)
                throw e
            })

        return true
    }
}