import {bloggerDBType} from "./types";
import {bloggersCollection} from "./db";

export const bloggersRepository = {
    async getBloggers(): Promise<bloggerDBType[]> {
        //const projection = {_id: 0}
        return bloggersCollection.find({}, {projection:{_id: 0}}).toArray()
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