import {EmailConfirmationDBType} from "../types/types";
import {emailConfirmationsCollection} from "./db";

export const emailConfirmationRepository = {
    async create(emailConformation: EmailConfirmationDBType) {
        await emailConfirmationsCollection.insertOne(emailConformation)
    }
}