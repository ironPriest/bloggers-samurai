import {UserDBType} from "../types/types";
import {usersCollection} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async create(user: UserDBType) {
        await usersCollection.insertOne(user)
        return user
    },
    async findByLogin(login: string) {
        return await usersCollection.findOne({login: login})
    },
    async findById(id: any) {
        return await usersCollection.findOne({id: id})
    },
    async getUsers(pageNumber: number, pageSize: number) {
        let totalCount = await usersCollection.count()
        let pageCount = Math.ceil(+totalCount / pageSize)
        return {
            "pagesCount": pageCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": await usersCollection
                .find()
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray()
        }
    },
    async delete(id: string) {
        let result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}