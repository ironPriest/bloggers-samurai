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
                websiteUrl: blogger.websiteUrl,
                createdAt: blogger.createdAt,
                description: blogger.description
            }
        } else {
            return null
        }

    },
    async createBlogger(name: string, websiteUrl: string, description: string): Promise<Omit<bloggerDBType, "_id">> {
        let newBlogger: bloggerDBType = {
            _id: new ObjectId(),
            id: v4(),
            name: name,
            websiteUrl: websiteUrl,
            description: description,
            createdAt: new Date()
        }
        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        return {
            id: createdBlogger.id,
            name: createdBlogger.name,
            websiteUrl: createdBlogger.websiteUrl,
            createdAt: createdBlogger.createdAt,
            description: createdBlogger.description
        }
    },
    async updateBlogger(bloggerId: string, name: string, youtubeUrl: string): Promise<boolean> {
        return bloggersRepository.updateBlogger(bloggerId, name, youtubeUrl)
    },
    async deleteBlogger(bloggerId: string): Promise<boolean> {
        return bloggersRepository.deleteBlogger(bloggerId)
    }
}