import {bloggerDBType} from "./types";
import {bloggersCollection} from "./db";

export const bloggersRepository = {
    async getBloggers(): Promise<bloggerDBType[]> {
        return bloggersCollection.find({})
    },
    async getBloggerById(bloggerId: number): Promise<bloggersType> {
        let blogger: bloggersType = bloggers.find(p => p.id === bloggerId)
        return blogger
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<bloggersType> {
            const newBlogger = {
                id: +(new Date()),
                name: name,
                youtubeUrl: youtubeUrl
            }
            bloggers.push(newBlogger)
            return newBlogger
    },
    async updateBlogger(bloggerId: number, name: string, youtubeUrl: string): Promise<boolean> {
        let blogger = bloggers.find(p => p.id === bloggerId)
        if (blogger) {
                blogger.name = name
                blogger.youtubeUrl = youtubeUrl
                return true
        } else {
            return false
        }
    },
    async deleteBlogger(bloggerId: number): Promise<boolean> {
        let blogger = bloggers.find(p => p.id === bloggerId)
        if (blogger) {
            bloggers = bloggers.filter((v) => v.id !== bloggerId)
            return true
        } else {
            return false
        }
    }
}