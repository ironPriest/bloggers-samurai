import {Request, Response, Router} from "express";
import {deviceAuthSessionsService} from "../domain/device-auth-sessions-service";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/', async (req: Request, res: Response) => {
    const sessions = await deviceAuthSessionsService.getSessions()
    return res.send(sessions).send(200)
})