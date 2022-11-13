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
        const sessions =  await deviceAuthSessionsCollection.find({}).toArray()
        console.log(sessions)
        return sessions
    }
}