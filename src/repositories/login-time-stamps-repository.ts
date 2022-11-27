import {loginTimeStampsCollection} from "./db";
import {LoginTimeStampType} from "../types/types";

export const loginTimeStampsRepository = {
    async add(timeStamp: LoginTimeStampType) {
        await loginTimeStampsCollection.insertOne(timeStamp)
    },
    async getTimeStampsQuantity(ip: string) {
        return await loginTimeStampsCollection.countDocuments({ip})
    },
    async getLastStamp(ip: string) {
        return await loginTimeStampsCollection.find({ip}).sort({'timeStamp': -1}).limit(1).toArray();
    },
    async getFirstStamp(ip: string) {
        return await loginTimeStampsCollection.find({ip}).sort({'timeStamp': 1}).limit(1).toArray();
    },
    async deleteStamps(ip: string) {
        await loginTimeStampsCollection.deleteMany({ip})
    }
}