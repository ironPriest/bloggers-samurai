import {MongoClient} from 'mongodb'
import {bloggerDBType, postDBType} from './types'

//const mongoUri = process.env.mongoURI || "mongodb+srv://andrei_shylovich:tDEU6uF8SedAaKvy@cluster0.huoctrk.mongodb.net/?retryWrites=true&w=majority"

export const client = new MongoClient("mongodb+srv://andrei_shylovich:tDEU6uF8SedAaKvy@cluster0.huoctrk.mongodb.net/?retryWrites=true&w=majority");

let db = client.db("testDB")

export const bloggersCollection = db.collection<bloggerDBType>('bloggers')
export const postsCollection = db.collection<postDBType>('posts')

export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}