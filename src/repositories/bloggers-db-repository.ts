import {bloggerDBType} from "../types/types";
import {bloggersCollection} from "./db";

export const bloggersRepository = {
    async getBloggers(
            searchTerm: string | undefined,
            pageNumber: number,
            pageSize: number,
            sortBy: string,
            sortDirection: string) {
        const filter: any = {}
        if (searchTerm) {
            filter.name = {$regex: searchTerm, $options: 'i'}
        }
        let totalCount = await bloggersCollection.count(filter)
        let pageCount = Math.ceil( +totalCount / pageSize)
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
            "items": await bloggersCollection
                .find(filter, {projection:{_id: 0}})
                .sort(sortFilter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray()
        }
    },
    async getBloggerById(bloggerId: string): Promise<bloggerDBType | null> {
        return await bloggersCollection.findOne({id: bloggerId})
    },
    async createBlogger(newBlogger: bloggerDBType): Promise<bloggerDBType> {
            await bloggersCollection.insertOne(newBlogger)
            return newBlogger
    },
    async updateBlogger(bloggerId: string, name: string, youtubeUrl: string): Promise<boolean> {
        let result = await bloggersCollection.updateOne({id: bloggerId}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },
    async deleteBlogger(bloggerId: string): Promise<boolean> {
        let result = await bloggersCollection.deleteOne({id: bloggerId})
        return result.deletedCount === 1
    },
    async deleteAll() {
        await bloggersCollection.deleteMany({})
    }
}