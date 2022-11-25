import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {differenceInSeconds} from "date-fns";

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

let timeStamps: Date[] = []
export  const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    timeStamps.push(new Date())
    //debugger
    if (differenceInSeconds(timeStamps[6], timeStamps[0]) > 10) timeStamps.splice(0)

    if (timeStamps.length > 5) return res.sendStatus(429)

    next()
}