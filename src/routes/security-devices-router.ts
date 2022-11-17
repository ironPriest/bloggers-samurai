import {Request, Response, Router} from "express";
import {deviceAuthSessionsService} from "../domain/device-auth-sessions-service";
import {jwtUtility} from "../application/jwt-utility";
import {deviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/', async (req: Request, res: Response) => {
    if (!req.cookies.refreshToken) {
        console.log('no cookies')
        return res.sendStatus(401)
    }
    const token = req.cookies.refreshToken
    console.log('rt --->', token)
    const deviceId = await jwtUtility.getDeviceIdByToken(token)
    if(!deviceId) {
        console.log('can not get deviceId from rt')
        return res.sendStatus(401)
    }
    const sessions = await deviceAuthSessionsService.getSessions()
    return res.status(200).send(sessions)
})
securityDevicesRouter.delete('/', async (req: Request, res: Response) => {
    if (!req.cookies.refreshToken) {
        return res.sendStatus(401)
    }
    const token = req.cookies.refreshToken
    const deviceId = await jwtUtility.getDeviceIdByToken(token)
    if(!deviceId) {
        return res.sendStatus(404)
    }
    await deviceAuthSessionsService.deleteExcept(deviceId)
    return res.sendStatus(204)
})
securityDevicesRouter.delete('/:deviceId', async (req: Request, res: Response) => {
    const session = await deviceAuthSessionsRepository.getSessionsByDeviceId(req.params.deviceId)
    const deviceId = session?.deviceId
    if (!deviceId) {
        return res.sendStatus(404)
    }
    if (!req.cookies.refreshToken) {
        return res.sendStatus(401)
    }
    const token = req.cookies.refreshToken
    const RTDeviceId = await jwtUtility.getDeviceIdByToken(token)
    if(!RTDeviceId) {
        return res.sendStatus(404)
    }
    const userId = await jwtUtility.getUserIdByToken(token)
    const checkRes = await deviceAuthSessionsRepository.check(userId!, req.params.deviceId)
    const varToCheck = checkRes?.lastActiveDate
    if (!varToCheck) {
        return res.sendStatus(403)
    }
    // if (RTDeviceId !== req.params.deviceId) {
    //     return res.sendStatus(403)
    // }
    await deviceAuthSessionsService.deleteByDeviceId(req.params.deviceId)
    return res.sendStatus(204)
})