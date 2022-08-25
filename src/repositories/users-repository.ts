import {UserDBType} from "../types/types";
import {usersCollection} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async create(user: UserDBType) {
        let res = await usersCollection.insertOne(user)
        if(!res){
            console.log('çreate user error')
            return
        }
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
                .find({}, {projection: {_id: 0, passwordHash: 0}})
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