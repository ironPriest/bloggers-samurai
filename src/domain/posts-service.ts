import {postDBType} from "../types/types";
import {postsRepository} from "../repositories/posts-db-repository";

export const postsService = {
    async getPosts(
        pageNumber: number,
        pageSize: number,
        bloggerId: string | null | undefined,
        sortBy: string,
        sortDirection: string) {
            return await postsRepository.getPosts(
                pageNumber,
                pageSize,
                bloggerId,
                sortBy,
                sortDirection)
    },
    async getPostById(postId: string): Promise<Omit<postDBType, '_id'> | null> {
        let post: postDBType | null | void = await postsRepository.getPostById(postId)
        if (post) {
            return {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                bloggerName: post.bloggerName,
                createdAt: post.createdAt
            }
        } else {
            return null
        }

    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<Omit<postDBType, "_id"> | undefined> {
        const createdPost = await postsRepository.createPost(title, shortDescription, content, bloggerId)
        if (createdPost) {
            return {
                id: createdPost.id,
                title: createdPost.title,
                shortDescription: createdPost.shortDescription,
                content: createdPost.content,
                blogId: createdPost.blogId,
                bloggerName: createdPost.bloggerName,
                createdAt: createdPost.createdAt
            }
        } else {
            return
        }

    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<number> {
        return postsRepository.updatePost(postId, title, shortDescription, content, bloggerId)
    },
    async deletePost(postId: string): Promise<boolean> {
        return postsRepository.deletePost(postId)
    }
}