import {WithId} from 'mongodb'

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