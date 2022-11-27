import {loginTimeStampsCollection} from "./db";
import {LoginTimeStampType} from "../types/types";
import {sub} from "date-fns";

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
    },
    async cleanStamps(ip: string) {
        //TODO aggregation needed?
        let threshold = await loginTimeStampsCollection.find({ip}).sort({'timeStamp': -1}).limit(1).toArray()
        await loginTimeStampsCollection.deleteMany({timeStamp: {$lt: sub(threshold[0].timeStamp, {seconds: 10})}})
    }
}