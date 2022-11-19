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
    async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({ $or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async findById(id: ObjectId) {
        return await usersCollection.findOne({_id: id})
    },
    async findByEmail(email: string): Promise<UserDBType | null> {
        return await usersCollection.findOne({email: email})
    },
    async getUsers(
            searchLoginTerm: string | undefined,
            searchEmailTerm: string | undefined,
            pageNumber: number,
            pageSize: number,
            sortBy: string,
            sortDirection: string) {
        const loginFilter: any = {}
        const emailFilter: any = {}
        if (searchLoginTerm) {
            loginFilter.login = {$regex: searchLoginTerm, $options: 'i'}
        }
        if (searchEmailTerm) {
            emailFilter.email = {$regex: searchEmailTerm, $options: 'i'}
        }
        let totalCount = await usersCollection.count({$or:[loginFilter, emailFilter]})
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
                .find({$or:[loginFilter, emailFilter]}, {projection: {_id: 0, passwordHash: 0}})
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