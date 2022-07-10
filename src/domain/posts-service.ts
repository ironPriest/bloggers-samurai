import {postDBType} from "../repositories/types";
import {postsRepository} from "../repositories/posts-db-repository";

export const postsService = {
    async getPosts(): Promise<postDBType[]> {
        return postsRepository.getPosts()
    },
    async getPostById(postId: number): Promise<postDBType | null> {
        return postsRepository.getPostById(postId)
    },
    async createPost(
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: number): Promise<Omit<postDBType, "_id"> | undefined> {
        const createdPost = await postsRepository.createPost(title, shortDescription, content, bloggerId)
        if (createdPost) {
            return {
                id: createdPost.id,
                title: createdPost.title,
                shortDescription: createdPost.shortDescription,
                content: createdPost.content,
                bloggerId: createdPost.bloggerId,
                bloggerName: createdPost.bloggerName
            }
        } else {
            return
        }

    },
    async updatePost(
        postId: number,
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: number): Promise<number> {
        return postsRepository.updatePost(postId, title, shortDescription, content, bloggerId)
    },
    async deletePost(postId: number): Promise<boolean> {
        return  postsRepository.deletePost(postId)
    }
}