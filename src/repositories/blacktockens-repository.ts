import {TokenDBType} from "../types/types";
import {blacktockensCollection} from "./db";


export const blacktockensRepository = {
    async addToList(token: TokenDBType) {
        let res = await blacktockensCollection.insertOne(token)
        return res.acknowledged
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