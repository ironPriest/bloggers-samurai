import {EmailConfirmationDBType} from "../types/types";
import {emailConfirmationsCollection} from "./db";

export const emailConfirmationRepository = {
    async create(emailConformation: EmailConfirmationDBType) {
        await emailConfirmationsCollection.insertOne(emailConformation)
    },
    async update(userId: string, newConfirmationCode: string) {
        await emailConfirmationsCollection.updateOne({userId: userId}, {$set: {confirmationCode: newConfirmationCode}})

    },
    async updateStatus(userId: string) {
        await emailConfirmationsCollection.updateOne({userId: userId}, {$set:{isConfirmed: true}})
    },
    async findByCode(code: string) {
        return await emailConfirmationsCollection.findOne({confirmationCode: code})
    },
    async findByUserId(userId: string) {
        return await emailConfirmationsCollection.findOne({userId: userId})
    }
}