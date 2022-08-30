import {CommentDBType} from "../types/types";
import {commentsCollection} from "./db";

export const commentsRepository = {
    async create(comment: CommentDBType): Promise<CommentDBType> {
        await commentsCollection.insertOne(comment)
        return comment
    },
    async findPostComments(postId: string) {
        return await commentsCollection.find({postId: postId});
    },
    async findCommentById(id: string) {
        return await commentsCollection.findOne({id: id})
    },
    async updateComment(id: string, content: string) {
        let result = await commentsCollection.updateOne({id: id}, {$set: {content: content}})
        return result.matchedCount === 1
    },
    async delete(id: string) {
        let result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}