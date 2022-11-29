import {ObjectId, WithId} from 'mongodb'

export type bloggerDBType = WithId<{
    id: string
    name: string
    websiteUrl: string
    description: string
    createdAt: Date
}>
export type postDBType = WithId<{
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    bloggerName: string | undefined
    createdAt: Date
}>
export type UserDBType = WithId<{
    id: string
    login: string
    passwordHash: string
    email: string
    createdAt: Date
}>
export type EmailConfirmationDBType = WithId<{
    userId: string
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}>
export type CommentDBType = WithId<{
    id: string
    content: string
    userId: string | ObjectId
    userLogin: string
    createdAt: Date
    postId: string
}>
export type TokenDBType = WithId<{
    token: string
}>
export type DeviceAuthSessionType = WithId<{
    lastActiveDate: Date
    deviceId: string
    ip: string
    title: string
    userId: ObjectId
    rtExpDate: Date
}>
export type TimeStampType = WithId<{
    route: string
    ip: string
    timeStamp: Date
}>
