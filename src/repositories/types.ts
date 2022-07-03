import {ObjectId, WithId} from 'mongodb'

export type bloggerDBType = WithId<{
    id: number
    name: string
    youtubeUrl: string
}>
export type postDBType = WithId<{
    id: number
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName: string
}>