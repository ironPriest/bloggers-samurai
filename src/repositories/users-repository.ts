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
    async findById(id: ObjectId) {
        return await usersCollection.findOne({_id: id})
    },
    async getUsers(
            searchLoginTerm: string | undefined,
            searchEmailTerm: string | undefined,
            pageNumber: number,
            pageSize: number,
            sortBy: string,
            sortDirection: string) {
        const filter: any = {}
        if (searchLoginTerm) {
            filter.name = {$regex: searchLoginTerm, $options: 'i'}
        }
        if (searchEmailTerm) {
            filter.name = {$regex: searchEmailTerm, $options: 'i'}
        }
        let totalCount = await usersCollection.count(filter)
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
            "items": await usersCollection
                .find(filter, {projection: {_id: 0, passwordHash: 0}})
                .sort(sortFilter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray()
        }
    },
    async delete(id: string) {
        let result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAll() {
        await usersCollection.deleteMany({})
    }
}