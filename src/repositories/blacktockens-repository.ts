import {TokenDBType} from "../types/types";
import {blacktockensCollection} from "./db";


export const blacktockensRepository = {
    async addToList(token: TokenDBType) {
        await blacktockensCollection.insertOne(token)
    },
    async check(token: TokenDBType): Promise<TokenDBType | null> {
        return await blacktockensCollection.findOne(token)
    }
}