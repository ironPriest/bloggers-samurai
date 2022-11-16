import {bloggerDBType, DeviceAuthSessionType} from "../types/types";
import {ObjectId} from "mongodb";
import {v4} from "uuid";
import add from "date-fns/add";
import {deviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";

export const deviceAuthSessionsService = {
    async create(ip: string, title: string, userId: ObjectId) {
        const deviceAuthSession: DeviceAuthSessionType = {
            _id: new ObjectId(),
            lastActiveDate: new Date(),
            deviceId: v4(),
            ip: ip,
            title: title,
            userId: userId,
            rtExpDate: add(new Date(), {seconds: 20})
        }
        await deviceAuthSessionsRepository.create(deviceAuthSession)
        return deviceAuthSession
    },
    async update(deviceId: string) {
        const newLastActiveDate = new Date()
        await deviceAuthSessionsRepository.update(deviceId, newLastActiveDate)
    },
    async getSessionByUserId(userId: ObjectId): Promise<DeviceAuthSessionType | null> {
        return await deviceAuthSessionsRepository.getSessionByUserId(userId)
    },
    async getSessions() {
        return await deviceAuthSessionsRepository.getSessions()
    },
    async deleteExcept(deviceId: string) {
        await deviceAuthSessionsRepository.deleteExcept(deviceId)
    },
    async deleteByDeviceId(deviceId: string) {
        await deviceAuthSessionsRepository.deleteByDeviceId(deviceId)
    }
}