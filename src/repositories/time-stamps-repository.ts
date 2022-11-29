import {timeStampsCollection} from "./db";
import {TimeStampType} from "../types/types";
import {sub} from "date-fns";

export const timeStampsRepository = {
    async add(timeStamp: TimeStampType) {
        await timeStampsCollection.insertOne(timeStamp)
    },
    async getTimeStampsQuantity(route: string, ip: string) {
        return await timeStampsCollection.countDocuments({route, ip})
    },
    async cleanStamps(route: string, ip: string, timeStamp: Date) {
        await timeStampsCollection.deleteMany({route, ip, timeStamp: {$lt: sub(timeStamp, {seconds: 10})}})
    }
}