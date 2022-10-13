import {EmailConfirmationDBType} from "../types/types";
import {emailConfirmationsCollection} from "./db";

export const emailConfirmationRepository = {
    async create(emailConformation: EmailConfirmationDBType) {
        await emailConfirmationsCollection.insertOne(emailConformation)
    },
    async update(userId: string, newConfirmaionCode: string) {
        await emailConfirmationsCollection.updateOne({userId: userId}, {$set: {confirmationCode: newConfirmaionCode}})

    }
}