import {NextFunction, Request, Response, Router} from "express";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {body, validationResult} from "express-validator";
import {
    contentChecker,
    inputValidationMiddleware,
    requestsCounterMiddleware
} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
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

bloggersRouter.get('/', (req: Request, res: Response ) => {
    const bloggers = bloggersRepository.getBloggers()
    res.send(bloggers)
})
bloggersRouter.get('/:bloggerId', (req: Request, res: Response) => {
    let blogger = bloggersRepository.getBloggerById(+req.params.bloggerId)
    if (blogger) {
        res.send(blogger)
    } else {
        res.send(404)
    }
})
bloggersRouter.post('/',
    authMiddleware,
    nameValidation,
    youtubeUrlValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
    const newBlogger = bloggersRepository.createBlogger(req.body.name, req.body.youtubeUrl)
    res.status(201).send(newBlogger)
})
bloggersRouter.put('/:bloggerId',
    authMiddleware,
    nameValidation,
    youtubeUrlValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
    const isUpdated = bloggersRepository.updateBlogger(
        +req.params.bloggerId,
        req.body.name,
        req.body.youtubeUrl)
    if (isUpdated) {
        const blogger = bloggersRepository.getBloggerById(+req.params.bloggerId)
        res.status(204).send(blogger)
    } else {
        res.send(404)
    }
})
bloggersRouter.delete('/:bloggerId',
    authMiddleware,
    (req: Request, res: Response)=>{
    const isDeleted = bloggersRepository.deleteBlogger(+req.params.bloggerId)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})