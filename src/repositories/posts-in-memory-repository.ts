//doesn't really need to be async

import {bloggers} from "./bloggers-in-memory-repository";

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
        return posts.find(p => p.id === postId)
    },
    createPost(
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: number) {
            const blogger = bloggers.find(p => p.id === bloggerId)
            if (!blogger) {
                return
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