//doesn't really need to be async

export let bloggers = [
    {id: 1, name: 'Mike', youtubeUrl: 'someURL1'},
    {id: 2, name: 'Bob', youtubeUrl: 'someURL2'},
    {id: 3, name: 'Alex', youtubeUrl: 'someURL3'},
    {id: 4, name: 'Susan', youtubeUrl: 'someURL4'},
    {id: 5, name: 'Andrew', youtubeUrl: 'someURL5'}
]

export const bloggersRepository = {
    getBloggers() {
        return bloggers
    },
    getBloggerById(bloggerId: number) {
        return bloggers.find(p => p.id === bloggerId)
    },
    createBlogger(name: string, youtubeUrl: string) {
            const newBlogger = {
                id: +(new Date()),
                name: name,
                youtubeUrl: youtubeUrl
            }
            bloggers.push(newBlogger)
            return newBlogger
    },
    updateBlogger(bloggerId: number, name: string, youtubeUrl: string) {
        let blogger = bloggers.find(p => p.id === bloggerId)
        if (blogger) {
                blogger.name = name
                blogger.youtubeUrl = youtubeUrl
                return true
        } else {
            return false
        }
    },
    deleteBlogger(bloggerId: number) {
        let blogger = bloggers.find(p => p.id === bloggerId)
        if (blogger) {
            bloggers = bloggers.filter((v) => v.id !== bloggerId)
            return true
        } else {
            return false
        }
    }
}