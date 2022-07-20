import {bloggerDBType} from "./types";
import {bloggersCollection} from "./db";

export const bloggersRepository = {
    async getBloggers(searchTerm: string | undefined, pageNumber: number, pageSize: number) {
        const filter: any = {}
        if (searchTerm) {
            filter.name = {$regex: searchTerm}
        }
        let totalCount/*: Promise<number> | number*/ = await bloggersCollection.count(filter)
        let pageCount = Math.ceil( +totalCount / pageSize)
        return {
            "pagesCount": pageCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": await bloggersCollection
                .find(filter, {projection:{_id: 0}})
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray()
        }
    },
    async getBloggerById(bloggerId: number): Promise<bloggerDBType | null> {
        return bloggersCollection.findOne({id: bloggerId})
    },
    async createBlogger(newBlogger: bloggerDBType): Promise<bloggerDBType> {
            await bloggersCollection.insertOne(newBlogger)
            return newBlogger
    },
    async updateBlogger(bloggerId: number, name: string, youtubeUrl: string): Promise<boolean> {
        let result = await bloggersCollection.updateOne({id: bloggerId}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },
    async deleteBlogger(bloggerId: number): Promise<boolean> {
        let result = await bloggersCollection.deleteOne({id: bloggerId})
        return result.deletedCount === 1
    }
}