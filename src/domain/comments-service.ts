import {ObjectId} from "mongodb";
import {commentsRepository} from "../repositories/comments-repository";
import {usersRepository} from "../repositories/users-repository";
import {CommentDBType, UserDBType} from "../types/types";
import {v4} from "uuid";

export const commentsService = {
    async create(content: string, userId: ObjectId, postId: string): Promise<Omit<CommentDBType, "_id" | "postId">> {
        const user: UserDBType | void | null = await usersRepository.findById(userId)
        let comment: CommentDBType = {
            _id: new ObjectId(),
            id: v4(),
            content: content,
            userId: user!.id,
            userLogin: user!.login,
            addedAt: new Date(),
            postId: postId
        }
        const createdComment = await commentsRepository.create(comment)
        return {
            id: createdComment.id,
            content: createdComment.content,
            userId: createdComment.userId,
            userLogin: createdComment.userLogin,
            addedAt: createdComment.addedAt
        }
    },
    async getPostComments(postId: string, pageNumber: number, pageSize: number) {
        return await commentsRepository.findPostComments(postId, pageNumber, pageSize)
    },
    async getCommentById(id: string) {
        return await commentsRepository.findCommentById(id)
    },
    async updateComment(id: string, content: string) {
        return commentsRepository.updateComment(id, content)
    },
    async delete(id: string): Promise<boolean> {
        return await commentsRepository.delete(id)
    }
}