import {bloggerDBType, postDBType} from "../types/types";
import {ObjectId} from "mongodb";
import {bloggersRepository} from "../repositories/bloggers-db-repository"

export const bloggersService = {
    async getBloggers(searchTerm: string | undefined, pageNumber: number, pageSize: number) {
        return await bloggersRepository.getBloggers(searchTerm, pageNumber, pageSize)
    },
    async getBloggerById(bloggerId: string): Promise<Omit<bloggerDBType, '_id'> | null> {
        let blogger: bloggerDBType | null | void = await bloggersRepository.getBloggerById(bloggerId)
        if (blogger) {
            return {
                id: blogger.id,
                name: blogger.name,
                youtubeUrl: blogger.youtubeUrl
            }
        } else {
            return null
        }

    },
    async createBlogger(name: string, youtubeUrl: string): Promise<Omit<bloggerDBType, "_id">> {
        let newBlogger: bloggerDBType = {
            _id: new ObjectId(),
            id: (new Date()).toString(),
            name: name,
            youtubeUrl: youtubeUrl
        }
        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        return {
            id: createdBlogger.id,
            name: createdBlogger.name,
            youtubeUrl: createdBlogger.youtubeUrl
        }
    },
    async updateBlogger(bloggerId: string, name: string, youtubeUrl: string): Promise<boolean> {
        return bloggersRepository.updateBlogger(bloggerId, name, youtubeUrl)
    },
    async deleteBlogger(bloggerId: string): Promise<boolean> {
        return bloggersRepository.deleteBlogger(bloggerId)
    }
}