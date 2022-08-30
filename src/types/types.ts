import {ObjectId, WithId} from 'mongodb'

export type bloggerDBType = WithId<{
    id: string
    name: string
    youtubeUrl: string
}>
export type postDBType = WithId<{
    id: string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string | undefined
}>
export type UserDBType = WithId<{
    id: string
    login: string
    passwordHash: string
}>
export type CommentDBType = WithId<{
    id: string
    content: string
    userId: string | ObjectId
    userLogin: string
    addedAt: Date
}>