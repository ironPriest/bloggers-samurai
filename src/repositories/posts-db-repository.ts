import {postDBType, bloggerDBType} from "../types/types";
import {bloggersCollection, postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {v4} from "uuid";

export const postsRepository = {
    async getPosts(
        pageNumber: number,
        pageSize: number,
        bloggerId: string | null | undefined,
        sortBy: string,
        sortDirection: string) {
        const filter: any = {}
        if (bloggerId) {
            filter.bloggerId = bloggerId
        }
        let totalCount = await postsCollection.count(filter)
        let pageCount = Math.ceil(+totalCount / pageSize)
        const sortFilter: any = {}
        switch (sortDirection) {
            case ('Asc'): sortFilter[sortBy] = 1
            break
            case ('Desc'): sortFilter[sortBy] = -1
            break
        }
        return {
            "pagesCount": pageCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": await postsCollection
                .find(filter, {projection:{_id: 0}})
                //.sort({"createdAt": -1})
                .sort(sortFilter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray()
        }
    },
    async getPostById(postId: string): Promise<postDBType | null | void> {
        return postsCollection.findOne({id: postId})
    },
    async createPost(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<postDBType | undefined> {
            let result = await bloggersCollection.find({id: blogId}).count()
            if (result === 1) {
                const blogger: bloggerDBType | null = await bloggersCollection.findOne({id: blogId})
                let newPost: postDBType
                await postsCollection.insertOne( newPost = {
                    _id: new ObjectId(),
                    id: v4(),
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                    bloggerName: blogger?.name,
                    createdAt: new Date()
                })
                return newPost
            } else {
                return
            }
        },
    async updatePost(
        postId: string,
        title: string,
        shortDescription: string,
        content: string,
        bloggerId: string): Promise<number> {
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
    async deletePost(postId: string): Promise<boolean> {
        let result = await postsCollection.deleteOne({id: postId})
        return result.deletedCount === 1
    },
    async deleteAll() {
        await postsCollection.deleteMany({})
    }
}