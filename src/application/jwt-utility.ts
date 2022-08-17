import {UserDBType} from "../types/types";
import jwt from 'jsonwebtoken'
import {settings} from "../types/settings";
import {ObjectId} from "mongodb";

export const jwtUtility = {
    async createJWT(user: UserDBType) {
        debugger
        return jwt.sign({userId: user._id}, settings.JWT_SECRET)
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }
}