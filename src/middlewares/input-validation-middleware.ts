import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {differenceInSeconds} from "date-fns";
import {loginTimeStampsRepository} from "../repositories/login-time-stamps-repository";
import {ObjectId} from "mongodb";
import {loginTimeStampsCollection} from "../repositories/db";
import {LoginTimeStampType} from "../types/types";

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

export  const loginRateLimiter = async (req: Request, res: Response, next: NextFunction) => {

    //TODO check result
    await loginTimeStampsRepository.add({
        _id: new ObjectId(),
        ip: req.ip,
        timeStamp: new Date()
    })

    // let lastStamp = await loginTimeStampsRepository.getLastStamp(req.ip)
    // let firstStamp = await loginTimeStampsRepository.getFirstStamp(req.ip)
    //
    // if (differenceInSeconds(lastStamp[0].timeStamp, firstStamp[0].timeStamp) > 10) {
    //     await loginTimeStampsRepository.deleteStamps(req.ip)
    // }

    //TODO check result
    await loginTimeStampsRepository.cleanStamps(req.ip)

    let timeStampsCounter = await loginTimeStampsRepository.getTimeStampsQuantity(req.ip)
    if (timeStampsCounter > 5) return res.sendStatus(429)

    next()
}