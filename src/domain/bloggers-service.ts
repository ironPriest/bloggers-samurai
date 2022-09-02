import {bloggerDBType, postDBType} from "../types/types";
import {ObjectId} from "mongodb";
import {bloggersRepository} from "../repositories/bloggers-db-repository"
import {v4} from 'uuid';

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
                youtubeUrl: blogger.youtubeUrl,
                addedAt: blogger.addedAt
            }
        } else {
            return null
        }

    },
    async createBlogger(name: string, youtubeUrl: string): Promise<Omit<bloggerDBType, "_id">> {
        let newBlogger: bloggerDBType = {
            _id: new ObjectId(),
            id: v4(),
            name: name,
            youtubeUrl: youtubeUrl,
            addedAt: new Date()
        }
        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        return {
            id: createdBlogger.id,
            name: createdBlogger.name,
            youtubeUrl: createdBlogger.youtubeUrl,
            addedAt: createdBlogger.addedAt
        }
    },
    async updateBlogger(bloggerId: string, name: string, youtubeUrl: string): Promise<boolean> {
        return bloggersRepository.updateBlogger(bloggerId, name, youtubeUrl)
    },
    async deleteBlogger(bloggerId: string): Promise<boolean> {
        return bloggersRepository.deleteBlogger(bloggerId)
    }
}