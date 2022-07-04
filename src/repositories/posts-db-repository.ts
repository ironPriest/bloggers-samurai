import {bloggers, bloggersType} from "./bloggers-db-repository";

let posts = [
    {id: 1, title: 'sports news', shortDescription: 'interesting', content: 'blabla', bloggerId: 1, bloggerName: 'Bob'},
    {id: 2, title: 'daily news', shortDescription: 'boring', content: 'sqewsqew', bloggerId: 2, bloggerName: 'Bob'},
    {id: 3, title: 'hype news', shortDescription: 'mediocre', content: 'mongmong', bloggerId: 2, bloggerName: 'Bob'},
    {id: 4, title: 'some title', shortDescription: 'interesting', content: 'barkbark', bloggerId: 3, bloggerName: 'Bob'},
    {id: 5, title: 'some title2', shortDescription: 'boring', content: 'meowmeow', bloggerId: 4, bloggerName: 'Bob'},
    {id: 6, title: 'hacker news', shortDescription: 'mediocre', content: 'blabla', bloggerId: 5, bloggerName: 'Bob'},
    {id: 7, title: 'incubator news', shortDescription: 'interesting', content: 'sqewsqew', bloggerId: 5, bloggerName: 'Bob'}
]

export type postType = {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
    bloggerName: string
} | undefined

export const postsRepository = {
    async getPosts(): Promise<postType[]> {
        return posts
    },
    async getPostById(postId: number): Promise<postType> {
        let post = posts.find(p => p.id === postId)
        return post
    },
    async createPost(
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: number): Promise<postType> {
            const blogger: bloggersType = await bloggers.find(p => p.id === bloggerId)
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
    async updatePost(
        postId: number,
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: number): Promise<number> {
        let post = posts.find(p => p.id === postId)
        if (post) {
            const blogger: bloggersType = await bloggers.find(p => p.id === bloggerId)
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
    async deletePost(postId: number): Promise<boolean> {
        let post = posts.find(p => p.id === postId)
        if (post) {
            posts = posts.filter((v) => v.id !== postId)
            return true
        } else {
            return false
        }
    }
}