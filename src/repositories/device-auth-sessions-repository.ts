import {DeviceAuthSessionType} from "../types/types";
import {deviceAuthSessionsCollection} from "./db";

export const deviceAuthSessionsRepository = {
    async create(deviceAuthSession: DeviceAuthSessionType) {
        await  deviceAuthSessionsCollection.insertOne(deviceAuthSession)
    },
    async getSessionByUserId(userId: string): Promise<DeviceAuthSessionType | null> {
        return await deviceAuthSessionsCollection.findOne({userId: userId})
    },
    async getSessions() {
        const sessions =  await deviceAuthSessionsCollection.find({}, {projection: {_id: 0, userId: 0, rtExpDate: 0}}).toArray()
        console.log(sessions)
        return sessions
    },
    async deleteAll() {
        await deviceAuthSessionsCollection.deleteMany({})
    }
}