import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-db-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {postDBType} from "../repositories/types";

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
    const posts: postDBType[] = await postsRepository.getPosts()
    res.send(posts)
})
postsRouter.get('/:postId', async(req: Request, res: Response ) => {
    const post: postDBType | null = await postsRepository.getPostById(+req.params.postId)
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
    const newPost: postDBType | undefined= await postsRepository.createPost(
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
    const isUpdated: number = await postsRepository.updatePost(
        +req.params.postId,
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.bloggerId)
    if (isUpdated === 2) {
        const post: postDBType | null = await postsRepository.getPostById(+req.params.postId)
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
    const isDeleted: boolean = await postsRepository.deletePost(+req.params.postId)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})