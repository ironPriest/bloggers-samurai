//doesn't really need to be async

import {bloggerDBType} from "./types";

export let bloggers = [
    {id: 1, name: 'Mike', youtubeUrl: 'someURL1'},
    {id: 2, name: 'Bob', youtubeUrl: 'someURL2'},
    {id: 3, name: 'Alex', youtubeUrl: 'someURL3'},
    {id: 4, name: 'Susan', youtubeUrl: 'someURL4'},
    {id: 5, name: 'Andrew', youtubeUrl: 'someURL5'}
]

export const bloggersRepository = {
    async getBloggers() {
        return bloggers
    },
    async getBloggerById(bloggerId: number) {
        let blogger = bloggers.find(p => p.id === bloggerId)
        return blogger
    },
    async createBlogger(name: string, youtubeUrl: string) {
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