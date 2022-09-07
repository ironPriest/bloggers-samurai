import {CommentDBType} from "../types/types";
import {commentsCollection} from "./db";

export const commentsRepository = {
    async create(comment: CommentDBType): Promise<CommentDBType> {
        await commentsCollection.insertOne(comment)
        return comment
    },
    async findPostComments(
            postId: string,
            pageNumber: number,
            pageSize: number,
            sortBy: string,
            sortDirection: string) {
        let totalCount = await commentsCollection.countDocuments({postId: postId})
        let pageCount = Math.ceil(+totalCount / pageSize)
        const sortFilter: any = {}
        switch (sortDirection) {
            case ('Asc'): sortFilter[sortBy] = 1
                break
            case ('Desc'): sortFilter[sortBy] = -1
                break
        }
        return {
            "pagesCount": pageCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": await commentsCollection
                .find( {postId: postId}, {projection:{_id: 0, postId: 0}})
                .sort(sortFilter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray()
        }
    },
    async findCommentById(id: string) {
        return await commentsCollection.findOne({id: id}, {projection: {_id: 0, postId: 0} })
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