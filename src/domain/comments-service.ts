import {ObjectId} from "mongodb";
import {commentsRepository} from "../repositories/comments-repository";
import {usersRepository} from "../repositories/users-repository";
import {CommentDBType, UserDBType} from "../types/types";

export const commentsService = {
    async create(content: string, userId: ObjectId | string) {
        const user: UserDBType | void | null = await usersRepository.findById(userId)
        let comment = {
            _id: new ObjectId(),
            id: (new Date()).toString().replace(/\s/g, ''),
            content: content,
            userId: userId,
            userLogin: user!.login,
            addedAt: new Date()
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
    async getPostComments(postId: string) {
        return await commentsRepository.findPostComments(postId)
    },
    async getCommentById(id: string) {
        return await commentsRepository.findCommentById(id)
    },
    async updateComment(id: string, content: string) {
        return commentsRepository.updateComment(id, content)
    },
    async delete(id: string) {
        return commentsRepository.delete(id)
    }
}