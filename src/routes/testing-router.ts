import {Request, Response, Router} from "express";
import {commentsRouter} from "./comments-router";
import {bloggersService} from "../domain/bloggers-service";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {postsRepository} from "../repositories/posts-db-repository";
import {usersRepository} from "../repositories/users-repository";
import {deviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await bloggersRepository.deleteAll()
    await postsRepository.deleteAll()
    await usersRepository.deleteAll()
    await deviceAuthSessionsRepository.deleteAll()
    res.sendStatus(204)
})