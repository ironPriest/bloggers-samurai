import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {body} from "express-validator";
import {
    inputValidationMiddleware,
    requestsCounterMiddleware
} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bloggerDBType} from "../repositories/types";
import {postsService} from "../domain/posts-service";
import {bloggerIdValidation, contentValidation, descValidation, titleValidation} from "./posts-router";
//import {ipCheckMiddleware} from "../middlewares/ip-check-middleware";

export const bloggersRouter = Router({})

//bloggersRouter.use(ipCheckMiddleware)
bloggersRouter.use(requestsCounterMiddleware)
//bloggersRouter.use(contentChecker('application/json'))

const nameValidation = body('name')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 15})

const youtubeUrlValidation = body('youtubeUrl')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 100})
    .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')

bloggersRouter.get('/', async(req: Request, res: Response) => {
    const PageNumber = req.query.PageNumber? +req.query.PageNumber: 1
    const PageSize = req.query.PageSize? +req.query.PageSize: 10
    const bloggers = await bloggersService.getBloggers(
        req.query.SearchNameTerm?.toString(),
        PageNumber,
        PageSize)
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
bloggersRouter.get('/:bloggerId/posts', async(req: Request, res: Response) => {
    let blogger = await bloggersService.getBloggerById(req.params.bloggerId)
    if (blogger) {
        const PageNumber = req.query.PageNumber? +req.query.PageNumber: 1
        const PageSize = req.query.PageSize? +req.query.PageSize: 10
        const posts = await postsService.getPosts(
            PageNumber,
            PageSize,
            +req.params.bloggerId)
        res.send(posts)
    } else {
        res.send(404)
    }
})
bloggersRouter.post('/',
    authMiddleware,
    youtubeUrlValidation,
    nameValidation,
    inputValidationMiddleware,
    async(req: Request, res: Response) => {
    const newBlogger = await bloggersService.createBlogger(
        req.body.name,
        req.body.youtubeUrl)
    res.status(201).send(newBlogger)
})
bloggersRouter.post('/:bloggerId/posts',
    authMiddleware,
    descValidation,
    titleValidation,
    contentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const newPost = await postsService.createPost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.params.bloggerId)
    if (newPost) {
        res.status(201).send(newPost)
    } else {
        res.status(404).json({
            errorsMessages: [{
                "message": "no such bloggerId!!",
                "field": "bloggerId"
            }]
        })
    }

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