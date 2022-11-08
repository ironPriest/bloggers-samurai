import {TokenDBType} from "../types/types";
import {blacktockensCollection} from "./db";


export const blacktockensRepository = {
    async addToList(token: TokenDBType) {
        await blacktockensCollection.insertOne(token)
    },
    async check(token: string): Promise<TokenDBType | null> {
        let res = await blacktockensCollection.findOne({token: token})
        if (res) {
            return res
        } else {
            return null
        }
    }
}