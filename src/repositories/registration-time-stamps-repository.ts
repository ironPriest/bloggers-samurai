import {registrationTimeStampsCollection} from "./db";
import {TimeStampType} from "../types/types";
import {sub} from "date-fns";

export const registrationTimeStampsRepository = {
    async add(timeStamp: TimeStampType) {
        await registrationTimeStampsCollection.insertOne(timeStamp)
    },
    async getTimeStampsQuantity(ip: string) {
        return await registrationTimeStampsCollection.countDocuments({ip})
    },
    async cleanStamps(ip: string) {
        //TODO aggregation needed?
        let threshold = await registrationTimeStampsCollection.find({ip}).sort({'timeStamp': -1}).limit(1).toArray()
        await registrationTimeStampsCollection.deleteMany({timeStamp: {$lt: sub(threshold[0].timeStamp, {seconds: 10})}})
    }
}