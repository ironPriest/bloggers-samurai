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
        bloggerId: number): Promise<postDBType | undefined> {
        return postsRepository.createPost(title, shortDescription, content, bloggerId)
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