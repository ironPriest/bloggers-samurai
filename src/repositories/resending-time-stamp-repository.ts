import {resendingTimeStampsCollection} from "./db";
import {TimeStampType} from "../types/types";
import {sub} from "date-fns";

export const resendingTimeStampsRepository = {
    async add(timeStamp: TimeStampType) {
        await resendingTimeStampsCollection.insertOne(timeStamp)
    },
    async getTimeStampsQuantity(ip: string) {
        return await resendingTimeStampsCollection.countDocuments({ip})
    },
    async cleanStamps(ip: string) {
        //TODO aggregation needed?
        let threshold = await resendingTimeStampsCollection.find({ip}).sort({'timeStamp': -1}).limit(1).toArray()
        await resendingTimeStampsCollection.deleteMany({timeStamp: {$lt: sub(threshold[0].timeStamp, {seconds: 10})}})
    }
}