import {MongoClient} from 'mongodb'
import {bloggerDBType, postDBType} from './types'

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017"

export const client = new MongoClient(mongoUri);

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