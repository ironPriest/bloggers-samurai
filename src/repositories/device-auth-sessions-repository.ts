import {DeviceAuthSessionType} from "../types/types";
import {deviceAuthSessionsCollection} from "./db";
import {ObjectId} from "mongodb";

export const deviceAuthSessionsRepository = {
    async create(deviceAuthSession: DeviceAuthSessionType) {
        await  deviceAuthSessionsCollection.insertOne(deviceAuthSession)
    },
    async update(deviceId: string, newLastActiveDate: Date) {
        await  deviceAuthSessionsCollection.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: newLastActiveDate}})
    },
    async getSessionByUserId(userId: ObjectId): Promise<DeviceAuthSessionType | null> {
        return await deviceAuthSessionsCollection.findOne({userId: userId})
    },
    async getSessionsByDeviceId(deviceId: string): Promise<DeviceAuthSessionType | null> {
        return await deviceAuthSessionsCollection.findOne({deviceId: deviceId})
    },
    async check(userId: ObjectId, deviceId: string): Promise<DeviceAuthSessionType | null> {
        return await deviceAuthSessionsCollection.findOne({$and: [{userId: userId}, {deviceId: deviceId}]})
    },
    async getSessions() {
        const sessions =  await deviceAuthSessionsCollection.find({}, {projection: {_id: 0, userId: 0, rtExpDate: 0}}).toArray()
        console.log(sessions)
        return sessions
    },
    async deleteAll() {
        await deviceAuthSessionsCollection.deleteMany({})
    },
    async deleteExcept(deviceId: string) {
        await deviceAuthSessionsCollection.deleteMany({deviceId: {$ne: deviceId}})
    },
    async deleteByDeviceId(deviceId: string) {
        await deviceAuthSessionsCollection.deleteOne({deviceId: deviceId})
    }
}