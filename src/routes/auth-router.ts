import {Request, Response, Router} from "express";
import {DeviceAuthSessionType, TokenDBType} from "../types/types";
import {authService} from "../domain/auth-service";
import {jwtUtility} from "../application/jwt-utility";
import {usersService} from "../domain/users-service";
import {emailConfirmationRepository} from "../repositories/emailconfirmation-repository";
import {blacktockensRepository} from "../repositories/blacktockens-repository";
import {deviceAuthSessionsService} from "../domain/device-auth-sessions-service";
import {inputValidationMiddleware, rateLimiter} from "../middlewares/input-validation-middleware";
import {body, header} from "express-validator";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";

export const authRouter = Router({})

const loginValidation = body('login')
    .trim()
    .exists({checkFalsy: true})
    .isString()
    .isLength({min: 3})
    .isLength({max: 10})

const passwordValidation = body('password')
    .trim()
    .exists({checkFalsy: true})
    .isString()
    .isLength({min: 6})
    .isLength({max: 20})

const emailValidation = body('email')
    .trim()
    .exists({checkFalsy: true})
    .isString()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')

const doubleLoginValidation = body('loginOrEmail').custom(async (loginOrEmail,) => {
    const user = await usersService.findByLoginOrEmail(loginOrEmail)
    if (user) {
        throw new Error('login already exists')
    }
    return true
})

const doubleEmailValidation = body('email').custom(async (email,) => {
    const user = await usersService.findByEmail(email)
    if (user) {
        throw new Error('email already exists')
    }
    return true
})

const doubleConfirmValidation = body('code').custom(async (code,) => {
    const emailConfirmation = await emailConfirmationRepository.findByCode(code)
    if (emailConfirmation) {
        if (emailConfirmation.isConfirmed) {
            throw new Error('already confirmed')
        } else return true
    } else throw new Error('no such user')

})

const doubleResendingValidation = body('email').custom(async (email,) => {
    const user = await usersService.findByEmail(email)
    if (user) {
        const emailConfirmation = await emailConfirmationRepository.findByUserId(user.id)
        if (emailConfirmation!.isConfirmed) {
            throw new Error('already confirmed')
        } else return true
    } else {
        throw new Error('no such email')
    }
})

authRouter.post('/login',
    rateLimiter,
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) return res.sendStatus(401)
        const userId = user._id

        const ip = req.ip
        const title = req.headers["user-agent"]!

        const deviceAuthSession: DeviceAuthSessionType =  await deviceAuthSessionsService.create(ip, title, userId)
        const deviceId = deviceAuthSession.deviceId

        const token = await jwtUtility.createJWT(user)
        const refreshToken = await jwtUtility.createRefreshToken(user, deviceId)

        return res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        })
            .send({
                'accessToken': token
            })
})

authRouter.post('/refresh-token', async (req: Request, res: Response) => {

        if (!req.cookies.refreshToken) {
            return res.sendStatus(401)
        }

        const reqRefreshToken = req.cookies.refreshToken
        // token check
        const blackToken: TokenDBType | null = await blacktockensRepository.check(reqRefreshToken)
        if (blackToken) {
            return res.sendStatus(401)
        }

        const userId = await jwtUtility.getUserIdByToken(req.cookies.refreshToken)
        if (!userId) {
            return res.sendStatus(401)
        }

        const user = await usersService.findById(userId)
        if (!user) {
            console.log('cant find user')
            return res.sendStatus(401)
        }

        await jwtUtility.addToBlackList(reqRefreshToken)
        const token = await jwtUtility.createJWT(user)
        const deviceAuthSession: DeviceAuthSessionType | null = await deviceAuthSessionsService.getSessionByUserId(user._id)
        if (!deviceAuthSession) {
            return res.sendStatus(404)
        }
        const refreshToken = await jwtUtility.createRefreshToken(user, deviceAuthSession.deviceId)
        const updateRes = await deviceAuthSessionsService.update(deviceAuthSession.deviceId)
        if (!updateRes) {
            return res.sendStatus(400)
        }
        return res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        }).send({
                'accessToken': token
            })


    })

authRouter.post(
    '/registration',
    loginValidation,
    passwordValidation,
    emailValidation,
    doubleLoginValidation,
    doubleEmailValidation,
    inputValidationMiddleware,
    rateLimiter,
    async (req: Request, res: Response) => {
        await authService.createUser(
            req.body.login,
            req.body.password,
            req.body.email)
        return res.sendStatus(204)
    })

authRouter.post('/registration-confirmation',
    doubleConfirmValidation,
    rateLimiter,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {
        await authService.confirm(req.body.code)
        return res.sendStatus(204)
    })

authRouter.post('/registration-email-resending',
    doubleResendingValidation,
    inputValidationMiddleware,
    rateLimiter,
    async (req: Request, res: Response) => {
        await authService.confirmationResend(req.body.email)
        return res.sendStatus(204)
    })

authRouter.post('/logout',async (req: Request, res: Response) => {

        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)

        const blackToken: TokenDBType | null = await blacktockensRepository.check(refreshToken)
        if (blackToken) return res.sendStatus(401)

        const userId = await jwtUtility.getUserIdByToken(refreshToken)
        if (!userId) return res.sendStatus(401)

        const deviceId = await jwtUtility.getDeviceIdByToken(refreshToken)

        const session = await deviceAuthSessionsService.getSessionByUserId(userId)
        if (!session) return res.sendStatus(401)

        const deleteResult = await deviceAuthSessionsService.deleteSession(deviceId, userId)
        if (!deleteResult) return res.sendStatus(400)

        const addingResult = await jwtUtility.addToBlackList(refreshToken)
        if (!addingResult) return res.sendStatus(400)

        return res.status(204).cookie('refreshToken', '', {
            httpOnly: true,
            secure: true
        }).send({})
    })

authRouter.get('/me',
    bearerAuthMiddleware,
    async (req: Request, res: Response) => {
        if (!req.headers.authorization) {
            return res.sendStatus(401)
        }
        const authType = req.headers.authorization.split(' ')[0]
        if (authType !== 'Bearer') return res.sendStatus(401)
        const token = req.headers.authorization.split(' ')[1]
        const userId = await jwtUtility.getUserIdByToken(token)
        if (!userId) return res.sendStatus(401)
        const user = await usersService.findById(userId)
        if (!user) return res.sendStatus(401)
        return res.status(200).send({
            email: user.email,
            login: user.login,
            userId: user.id
        })
    })