import {bloggerDBType} from "./types";
import {bloggersCollection} from "./db";
import {ObjectId} from "mongodb";

export const bloggersRepository = {
    async getBloggers(): Promise<bloggerDBType[]> {
        return bloggersCollection.find({}).toArray()
    },
    async getBloggerById(bloggerId: number): Promise<bloggerDBType | null> {
        return bloggersCollection.findOne({id: bloggerId})
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<bloggerDBType> {
            let newBlogger: bloggerDBType
            await bloggersCollection.insertOne(newBlogger = {_id: new ObjectId(), id: +(new Date()), name: name, youtubeUrl: youtubeUrl})
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