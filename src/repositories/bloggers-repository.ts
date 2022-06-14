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
        let blogger = bloggers.find(p => p.id === bloggerId)
        return blogger
    },
    createBlogger(name: string, youtubeUrl: string) {
        /*let name = name
        let youtubeUrl = youtubeUrl
        if ((!name || typeof name !== 'string' || !name.trim() || name.length > 15) && (!youtubeUrl || typeof youtubeUrl !== 'string' || youtubeUrl.length > 100 || !/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(youtubeUrl))) {
            res.status(400).send({
                errorsMessages: [{
                    "message": "invalid value",
                    "field": "youtubeUrl"
                },
                    {
                        "message": "invalid value",
                        "field": "name"
                    }],
                resultCode: 1
            })
            return
        } else if (!name || typeof name !== 'string' || !name.trim() || name.length > 15) {
            res.status(400).send({
                errorsMessages: [{
                    "message": "invalid value",
                    "field": "name"
                }],
                resultCode: 1
            })
            return
        } else if (!youtubeUrl || typeof youtubeUrl !== 'string' || youtubeUrl.length > 100 || !/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(youtubeUrl)) {
            res.status(400).send({
                errorsMessages: [{
                    "message": "invalid value",
                    "field": "youtubeUrl"
                }],
                "resultCode": 1
            })
            return
        } else {*/
            const newBlogger = {
                id: +(new Date()),
                name: name,
                youtubeUrl: youtubeUrl
            }
            bloggers.push(newBlogger)
            return newBlogger
        /*}*/
    },
    updateBlogger(bloggerId: number, name: string, youtubeUrl: string) {
        let blogger = bloggers.find(p => p.id === bloggerId)
        if (blogger) {
            /*let name = req.body.name
            let youtubeUrl = req.body.youtubeUrl
            if ((!name || typeof name !== 'string' || !name.trim() || name.length > 15) && (!youtubeUrl || typeof youtubeUrl !== 'string' || youtubeUrl.length > 100 || !/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(youtubeUrl))) {
                res.status(400).send({
                    errorsMessages: [{
                        "message": "invalid value",
                        "field": "youtubeUrl"
                    },
                        {
                            "message": "invalid value",
                            "field": "name"
                        }],
                    resultCode: 1
                })
                return
            } else if (!name || typeof name !== 'string' || !name.trim() || name.length > 15) {
                res.status(400).send({
                    errorsMessages: [{
                        "message": "invalid value",
                        "field": "name"
                    }],
                    "resultCode": 1
                })
                return
            } else if (!youtubeUrl || typeof youtubeUrl !== 'string' || youtubeUrl.length > 100 || !/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(youtubeUrl)) {
                res.status(400).send({
                    errorsMessages: [{
                        "message": "invalid value",
                        "field": "youtubeUrl"
                    }],
                    "resultCode": 1
                })
                return
            } else {*/
                blogger.name = name
                blogger.youtubeUrl = youtubeUrl
                return true
            /*}*/
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