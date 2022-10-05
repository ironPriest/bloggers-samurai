import {Request, Response, Router} from "express";
import {authService} from "../domain/auth-service";
import {jwtUtility} from "../application/jwt-utility";
import {emailAdapter} from "../adapters/email-adapter";
import {emailService} from "../domain/email-service";


export const authRouter = Router({})

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

authRouter.post('/registration', async(req: Request, res: Response) => {
    await authService.createUser(
        req.body.login,
        req.body.password,
        req.body.email)
    res.sendStatus(204)
})