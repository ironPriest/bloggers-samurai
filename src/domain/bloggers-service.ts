import {bloggerDBType} from "../repositories/types";
import {ObjectId} from "mongodb";
import {bloggersRepository} from "../repositories/bloggers-db-repository"

export const bloggersService = {
    async getBloggers(): Promise<bloggerDBType[]> {
        return bloggersRepository.getBloggers()
    },
    async getBloggerById(bloggerId: number): Promise<bloggerDBType | null> {
        return bloggersRepository.getBloggerById(bloggerId)
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<bloggerDBType> {
        let newBlogger: bloggerDBType = {
            _id: new ObjectId(),
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl}
        return await bloggersRepository.createBlogger(newBlogger)
    },
    async updateBlogger(bloggerId: number, name: string, youtubeUrl: string): Promise<boolean> {
        return bloggersRepository.updateBlogger(bloggerId, name, youtubeUrl)
    },
    async deleteBlogger(bloggerId: number): Promise<boolean> {
        return bloggersRepository.deleteBlogger(bloggerId)
    }
}