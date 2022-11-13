import {UserDBType} from "../types/types";
import jwt from 'jsonwebtoken'
import {settings} from "../types/settings";
import {ObjectId} from "mongodb";
import {blacktockensRepository} from "../repositories/blacktockens-repository";

export const jwtUtility = {
    async createJWT(user: UserDBType) {
        return jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '10s'})
    },
    async createRefreshToken(user: UserDBType, deviceId: string) {
        return jwt.sign({userId: user._id, deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: '20s'})
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    },
    async getDeviceIdByToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            return result.deviceId
        } catch (error) {
            return null
        }
    },
    async addToBlackList(corruptedToken: string) {
        let token = {
            _id: new ObjectId(),
            token: corruptedToken
        }
        await blacktockensRepository.addToList(token)
    }
}