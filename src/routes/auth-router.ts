import {Request, Response, Router} from "express";
import {authService} from "../domain/auth-service";
import {jwtUtility} from "../application/jwt-utility";
import {emailAdapter} from "../adapters/email-adapter";
import {emailService} from "../domain/email-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {body} from "express-validator";
import {usersService} from "../domain/users-service";
import {emailConfirmationRepository} from "../repositories/emailconfirmation-repository";


export const authRouter = Router({})

const doubleLoginValidation = body('login').custom(async (login, ) => {
    const user = await usersService.findByLogin(login)
    if (user) {
        throw new Error('login already exists')
    }
    return true
})

const doubleEmailValidation = body('email').custom(async (email, ) => {
    const user = await usersService.findByEmail(email)
    if (user) {
        throw new Error('email already exists')
    }
    return true
})

const doubleConfirmValidation = body('code').custom(async (code, ) => {
    const emailConfirmation = await emailConfirmationRepository.findByCode(code)
    if (emailConfirmation) {
        if (emailConfirmation.isConfirmed) {
            throw new Error('already confirmed')
        } else return
    } else throw new Error('no such user')

})

authRouter.post('/login',
    async(req: Request, res: Response) => {
    const user = await authService.checkCredentials(req.body.login, req.body.password)
    if (user) {
        const token = await jwtUtility.createJWT(user)
        res.status(200).send({
            'accessToken': token
        })
    } else {
        res.sendStatus(401)
    }
})

authRouter.post(
    '/registration',
    doubleLoginValidation,
    doubleEmailValidation,
    inputValidationMiddleware,
    async(req: Request, res: Response) => {
    await authService.createUser(
        req.body.login,
        req.body.password,
        req.body.email)
    res.sendStatus(204)
})

authRouter.post('/registration-confirmation',
    doubleConfirmValidation,
    inputValidationMiddleware,
    async(req: Request, res: Response) =>{
    await authService.confirm(req.body.code)
    res.sendStatus(204)
})

authRouter.post('/registration-email-resending', async(req: Request, res: Response) => {
    await authService.confirmationResend(req.body.email)
    res.sendStatus(204)
})