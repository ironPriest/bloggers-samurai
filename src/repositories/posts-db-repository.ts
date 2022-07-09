import {postDBType, bloggerDBType} from "./types";
import {bloggersCollection, postsCollection} from "./db";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async getPosts(): Promise<postDBType[]> {
        return postsCollection.find({}, {projection:{_id: 0}}).toArray()
    },
    async getPostById(postId: number): Promise<postDBType | null> {
        return postsCollection.findOne({id: postId})
    },
    async createPost(
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: number): Promise<postDBType | undefined> {
            let result = await bloggersCollection.find({id: bloggerId}).count()
            if (result === 1) {
                const blogger: bloggerDBType | null = await bloggersCollection.findOne({id: bloggerId})
                let newPost: postDBType
                await postsCollection.insertOne( newPost = {
                    _id: new ObjectId(),
                    id: +(new Date()),
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    bloggerId: bloggerId,
                    bloggerName: blogger?.name
                })
                return newPost
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
        let result = await postsCollection.find({id: postId}).count()
        if (result === 1) {
            let result = await bloggersCollection.find({id: bloggerId}).count()
            if (result === 1) {
                await postsCollection.updateOne({id: postId}, {$set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    bloggerId: bloggerId
                }})
                return 2
            } else {
                return 1
            }
        } else {
            return 0
        }
    },
    async deletePost(postId: number): Promise<boolean> {
        let result = await postsCollection.deleteOne({id: postId})
        return result.deletedCount === 1
    }
}