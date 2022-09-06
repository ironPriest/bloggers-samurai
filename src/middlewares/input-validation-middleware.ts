import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsHeap = errors.array(/*{onlyFirstError: true}*/).map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        })
        if (errorsHeap[0].field === 'bloggerId') {
            res.status(404).json({errorsMessages: errorsHeap})
            return
        }
        res.status(400).json({errorsMessages: errorsHeap});
        return
    } else {
        next()
    }
}

let reqCounter = 0
export const requestsCounterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    reqCounter ++
    res.header('requests', reqCounter.toString())
    next()
}

export const contentChecker = (contentType: string) => (req: Request, res: Response, next: NextFunction) => {
    const contentToCheck = req.headers['content-type']
    if (contentToCheck === contentType) {
        next()
    } else {
        res.status(400).send('Bad content type')
    }
}