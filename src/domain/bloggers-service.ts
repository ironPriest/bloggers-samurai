import {bloggerDBType, postDBType} from "../types/types";
import {ObjectId} from "mongodb";
import {bloggersRepository} from "../repositories/bloggers-db-repository"
import {v4} from 'uuid';

export const bloggersService = {
    async getBloggers(
        searchTerm: string | undefined,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string) {
            return await bloggersRepository.getBloggers(
                searchTerm,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection)
    },
    async getBloggerById(bloggerId: string): Promise<Omit<bloggerDBType, '_id'> | null> {
        let blogger: bloggerDBType | null | void = await bloggersRepository.getBloggerById(bloggerId)
        if (blogger) {
            return {
                id: blogger.id,
                name: blogger.name,
                youtubeUrl: blogger.youtubeUrl,
                createdAt: blogger.createdAt
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
            createdAt: new Date()
        }
        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        return {
            id: createdBlogger.id,
            name: createdBlogger.name,
            youtubeUrl: createdBlogger.youtubeUrl,
            createdAt: createdBlogger.createdAt
        }
    },
    async updateBlogger(bloggerId: string, name: string, youtubeUrl: string): Promise<boolean> {
        return bloggersRepository.updateBlogger(bloggerId, name, youtubeUrl)
    },
    async deleteBlogger(bloggerId: string): Promise<boolean> {
        return bloggersRepository.deleteBlogger(bloggerId)
    }
}