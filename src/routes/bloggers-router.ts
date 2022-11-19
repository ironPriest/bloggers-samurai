import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {body, param} from "express-validator";
import {
    inputValidationMiddleware,
    requestsCounterMiddleware
} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bloggerDBType} from "../types/types";
import {postsService} from "../domain/posts-service";
import {contentValidation, descValidation, titleValidation} from "./posts-router";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";
//import {ipCheckMiddleware} from "../middlewares/ip-check-middleware";

export const bloggersRouter = Router({})

//bloggersRouter.use(ipCheckMiddleware)
bloggersRouter.use(requestsCounterMiddleware)
//bloggersRouter.use(contentChecker('application/json'))

const nameValidation = body('name')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 15})

const youtubeUrlValidation = body('websiteUrl')
    .trim()
    .bail()
    .exists({checkFalsy: true})
    .bail()
    .isLength({max: 100})
    .bail()
    .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')

const bloggerIdValidation = param('bloggerId').custom(async (bloggerId, ) => {
    const blogger = await bloggersService.getBloggerById(bloggerId)
    //console.log(blogger, 'blogger')
    if (!blogger) {
        throw new Error('such blogger doesnt exist')
    }
    return true
})

bloggersRouter.get('/', async(req: Request, res: Response) => {
    const pageNumber = req.query.pageNumber? +req.query.pageNumber: 1
    const pageSize = req.query.pageSize? +req.query.pageSize: 10
    const sortBy = req.query.sortBy? req.query.sortBy.toString(): 'createdAt'
    const sortDirection = req.query.sortDirection? req.query.sortDirection.toString(): 'Desc'
    const bloggers = await bloggersService.getBloggers(
        req.query.searchNameTerm?.toString(),
        pageNumber,
        pageSize,
        sortBy,
        sortDirection)
    res.send(bloggers)
})
bloggersRouter.get('/:bloggerId', async(req: Request, res: Response) => {
    let blogger = await bloggersService.getBloggerById(req.params.bloggerId)
    if (blogger) {
        res.send(blogger)
    } else {
        res.send(404)
    }
})
bloggersRouter.get('/:bloggerId/posts',
    bloggerIdValidation,
    inputValidationMiddleware,
    async(req: Request, res: Response) => {
    let blogger = await bloggersService.getBloggerById(req.params.bloggerId)
    if (blogger) {
        const pageNumber = req.query.pageNumber? +req.query.pageNumber: 1
        const pageSize = req.query.pageSize? +req.query.pageSize: 10
        const sortBy = req.query.sortBy? req.query.sortBy.toString(): 'createdAt'
        const sortDirection = req.query.sortDirection? req.query.sortDirection.toString(): 'Desc'
        const posts = await postsService.getPosts(
            pageNumber,
            pageSize,
            req.params.bloggerId,
            sortBy,
            sortDirection)
        res.send(posts)
    } else {
        res.send(404)
    }
})
bloggersRouter.post('/',
    authMiddleware,
    nameValidation,
    youtubeUrlValidation,
    inputValidationMiddleware,
    async(req: Request, res: Response) => {
    const newBlogger = await bloggersService.createBlogger(
        req.body.name,
        req.body.websiteUrl,
        req.body.description)
    res.status(201).send(newBlogger)
})
bloggersRouter.post('/:bloggerId/posts',
    authMiddleware,
    descValidation,
    titleValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const newPost = await postsService.createPost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.params.bloggerId)
        res.status(201).send(newPost)
    // if (newPost) {
    //     res.status(201).send(newPost)
    // } else {
    //     res.status(404).json({
    //         errorsMessages: [{
    //             "message": "no such bloggerId!!",
    //             "field": "bloggerId"
    //         }]
    //     })
    // }
})
bloggersRouter.put('/:bloggerId',
    authMiddleware,
    youtubeUrlValidation,
    nameValidation,
    inputValidationMiddleware,
    async(req: Request, res: Response) => {
    const isUpdated: boolean = await bloggersService.updateBlogger(
        req.params.bloggerId,
        req.body.name,
        req.body.youtubeUrl)
    if (isUpdated) {
        const blogger = await bloggersService.getBloggerById(req.params.bloggerId)
        res.status(204).send(blogger)
    } else {
        res.send(404)
    }
})
bloggersRouter.delete('/:bloggerId',
    authMiddleware,
    async(req: Request, res: Response)=>{
    const isDeleted: boolean = await bloggersService.deleteBlogger(req.params.bloggerId)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})