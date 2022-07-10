import {Request, Response, Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {postDBType} from "../repositories/types";
import {postsService} from "../domain/posts-service";

export const postsRouter = Router({})

const titleValidation = body('title')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 30})

const descValidation = body('shortDescription')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 100})

const contentValidation = body('content')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 1000})

const bloggerIdValidation = body('bloggerId')
    .isInt()
    .exists({checkFalsy: true})

postsRouter.get('/', async(req: Request, res: Response ) => {
    const posts: postDBType[] = await postsService.getPosts()
    res.send(posts)
})
postsRouter.get('/:postId', async(req: Request, res: Response ) => {
    const post = await postsService.getPostById(+req.params.postId)
    if (post) {
        res.send(post)
    } else {
        res.send(404)
    }
})
postsRouter.post('/',
    authMiddleware,
    titleValidation,
    descValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware,
    async(req: Request, res: Response) => {
    const newPost = await postsService.createPost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.bloggerId)
    if (newPost) {
        res.status(201).send(newPost)
    } else {
        res.status(400).json({
            errorsMessages: [{
                "message": "no such bloggerId!!",
                "field": "bloggerId"
            }],
            resultCode: 1 })
    }

})
postsRouter.put('/:postId',
    authMiddleware,
    titleValidation,
    descValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware,
    async(req: Request, res: Response) => {
    const isUpdated: number = await postsService.updatePost(
        +req.params.postId,
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.bloggerId)
    if (isUpdated === 2) {
        const post = await postsService.getPostById(+req.params.postId)
        res.status(204).send(post)
    } else  if (isUpdated === 1) {
        res.status(400).json({
            errorsMessages: [{
                "message": "no such bloggerId",
                "field": "bloggerId"
            }],
            resultCode: 1 })
    } else {
        res.send(404)
    }
})
postsRouter.delete('/:postId',
    authMiddleware,
    async(req: Request, res: Response)=>{
    const isDeleted: boolean = await postsService.deletePost(+req.params.postId)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})