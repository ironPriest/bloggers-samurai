import {MongoClient} from 'mongodb'
import {
    bloggerDBType,
    postDBType,
    UserDBType,
    CommentDBType,
    EmailConfirmationDBType,
    TokenDBType,
    DeviceAuthSessionType,
    TimeStampType
} from '../types/types'

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017"

export const client = new MongoClient(mongoUri);

let db = client.db("testDB")

export const bloggersCollection = db.collection<bloggerDBType>('bloggers')
export const postsCollection = db.collection<postDBType>('posts')
export const usersCollection = db.collection<UserDBType>('users')
export const commentsCollection = db.collection<CommentDBType>('comments')
export const emailConfirmationsCollection = db.collection<EmailConfirmationDBType>('confirmations')
export const blacktockensCollection = db.collection<TokenDBType>('tokenBlackList')
export const deviceAuthSessionsCollection = db.collection<DeviceAuthSessionType>('deviceAuthSessions')
export const timeStampsCollection = db.collection<TimeStampType>('timeStamps')

export async function runDb() {
    try {
        console.log(mongoUri)
        // Connect the client to the server
        await client.connect();
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}