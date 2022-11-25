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

        if (errorsHeap[0].field === 'bloggerId') return res.status(404).json({errorsMessages: errorsHeap})

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

let registrationTimeStamps: Date[] = []
export  const registrationRateLimiter = (req: Request, res: Response, next: NextFunction) => {
    registrationTimeStamps.push(new Date())

    if (differenceInSeconds(registrationTimeStamps[6], registrationTimeStamps[0]) > 10) registrationTimeStamps.splice(0)

    if (registrationTimeStamps.length > 5) return res.sendStatus(429)

    next()
}

let loginTimeStamps: Date[] = []
export  const loginRateLimiter = (req: Request, res: Response, next: NextFunction) => {
    loginTimeStamps.push(new Date())

    if (differenceInSeconds(loginTimeStamps[6], loginTimeStamps[0]) > 10) loginTimeStamps.splice(0)

    if (loginTimeStamps.length > 5) return res.sendStatus(429)

    next()
}