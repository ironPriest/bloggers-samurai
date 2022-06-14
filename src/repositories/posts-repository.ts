import{bloggers} from "./bloggers-repository";
/*let bloggers = [
    {id: 1, name: 'Mike', youtubeUrl: 'someURL1'},
    {id: 2, name: 'Bob', youtubeUrl: 'someURL2'},
    {id: 3, name: 'Alex', youtubeUrl: 'someURL3'},
    {id: 4, name: 'Susan', youtubeUrl: 'someURL4'},
    {id: 5, name: 'Andrew', youtubeUrl: 'someURL5'}
]*/
let posts = [
    {id: 1, title: 'sports news', shortDescription: 'interesting', content: 'blabla', bloggerId: 1, bloggerName: 'Bob'},
    {id: 2, title: 'daily news', shortDescription: 'boring', content: 'sqewsqew', bloggerId: 2, bloggerName: 'Bob'},
    {id: 3, title: 'hype news', shortDescription: 'mediocre', content: 'mongmong', bloggerId: 2, bloggerName: 'Bob'},
    {id: 4, title: 'some title', shortDescription: 'interesting', content: 'barkbark', bloggerId: 3, bloggerName: 'Bob'},
    {id: 5, title: 'some title2', shortDescription: 'boring', content: 'meowmeow', bloggerId: 4, bloggerName: 'Bob'},
    {id: 6, title: 'hacker news', shortDescription: 'mediocre', content: 'blabla', bloggerId: 5, bloggerName: 'Bob'},
    {id: 7, title: 'incubator news', shortDescription: 'interesting', content: 'sqewsqew', bloggerId: 5, bloggerName: 'Bob'}
]

export const postsRepository = {
    getPosts() {
        return posts
    },
    getPostById(postId: number) {
        let post = posts.find(p => p.id === postId)
        return post
    },
    createPost(
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: number) {
        /*let title = req.body.title
        let desc = req.body.shortDescription
        let content = req.body.content
        let bloggerId = req.body.bloggerId
        if ((!title || typeof title !== 'string' || !title.trim() || title.length > 30) && (!desc || typeof desc !== 'string' || desc.length > 100)) {
            res.status(400).send({
                errorsMessages: [{
                    "message": "invalid value",
                    "field": "shortDescription"
                },
                    {
                        "message": "invalid value",
                        "field": "title"
                    }],
                "resultCode": 1
            })
            return
        } else if ((!title || typeof title !== 'string' || !title.trim() || title.length > 30) && (!content || typeof content !== 'string' || !content.trim() || content.length > 1000)) {
            res.status(400).send({
                errorsMessages: [{
                    "message": "invalid value",
                    "field": "title"
                },
                    {
                        "message": "invalid value",
                        "field": "content"
                    }],
                "resultCode": 1
            })
            return
        } else if (!desc || typeof desc !== 'string' || desc.length > 100) {
            res.status(400).send({
                errorsMessages: [{
                    "message": "invalid value",
                    "field": "shortDescription"
                }],
                "resultCode": 1
            })
            return
        } else {*/
            const blogger = bloggers.find(p => p.id === bloggerId)
            if (!blogger) {
                return false
            } else {
                const newPost = {
                    id: +(new Date()),
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    bloggerId: bloggerId,
                    bloggerName: blogger.name
                }
                posts.push(newPost)
                return newPost
            }
        },
    updatePost(
        postId: number,
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: number) {
        let post = posts.find(p => p.id === postId)
        if (post) {
            /*let title = req.body.title
            let desc = req.body.shortDescription
            let content = req.body.content
            if ((!title || typeof title !== 'string' || !title.trim() || title.length > 30) && (!desc || typeof desc !== 'string' || desc.length > 100)) {
                res.status(400).send({
                    errorsMessages: [{
                        "message": "invalid value",
                        "field": "shortDescription"
                    },
                        {
                            "message": "invalid value",
                            "field": "title"
                        }],
                    "resultCode": 1
                })
                return
            }
            else if ((!title || typeof title !== 'string' || !title.trim() || title.length > 30) && (!content || typeof content !== 'string' || !content.trim() || content.length > 1000)) {
                res.status(400).send({
                    errorsMessages: [{
                        "message": "invalid value",
                        "field": "title"
                    },
                        {
                            "message": "invalid value",
                            "field": "content"
                        }],
                    "resultCode": 1
                })
                return
            } else if (!desc || typeof desc !== 'string' || desc.length > 100) {
                res.status(400).send({
                    errorsMessages: [{
                        "message": "invalid value",
                        "field": "shortDescription"
                    }],
                    "resultCode": 1
                })
                return
            } else {
                const blogger = bloggers.find(p => p.id === req.body.bloggerId)
                if (!blogger) {
                    res.status(400).send({
                        errorsMessages: [{
                            "message": "invalid value",
                            "field": "bloggerId"
                        }],
                        "resultCode": 1
                    })
                    return
                }*/
            const blogger = bloggers.find(p => p.id === bloggerId)
            if (blogger) {
                post.title = title
                post.shortDescription = shortDescription
                post.content = content
                post.bloggerId = bloggerId
                return 2
            } else {
                return 1
            }
        } else {
            return 0
        }
    },
    deletePost(postId: number) {
        let post = posts.find(p => p.id === postId)
        if (post) {
            posts = posts.filter((v) => v.id !== postId)
            return true
        } else {
            return false
        }
    }
}