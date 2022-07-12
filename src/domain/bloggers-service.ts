import {bloggerDBType, postDBType} from "../repositories/types";
import {ObjectId} from "mongodb";
import {bloggersRepository} from "../repositories/bloggers-db-repository"

export const bloggersService = {
    async getBloggers(): Promise<bloggerDBType[]> {
        return bloggersRepository.getBloggers()
    },
    async getBloggerById(bloggerId: number): Promise<Omit<bloggerDBType, '_id'> | null> {
        let blogger: bloggerDBType | null = await bloggersRepository.getBloggerById(bloggerId)
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
            id: +(new Date()),
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
    async updateBlogger(bloggerId: number, name: string, youtubeUrl: string): Promise<boolean> {
        return bloggersRepository.updateBlogger(bloggerId, name, youtubeUrl)
    },
    async deleteBlogger(bloggerId: number): Promise<boolean> {
        return bloggersRepository.deleteBlogger(bloggerId)
    }
}