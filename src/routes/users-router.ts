import {Request, Response, Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {body} from "express-validator";
import {usersService} from "../domain/users-service";

export const usersRouter = Router({})

const loginValidation = body('login')
    .exists()
    .isString()
    .trim()
    .isLength({min: 3})
    .isLength({max: 10})

const passwordValidation = body('password')
    .exists()
    .isString()
    .trim()
    .isLength({min: 6})
    .isLength({max: 20})

usersRouter.post('/',
    authMiddleware,
    loginValidation,
    passwordValidation,
    inputValidationMiddleware,
    async(req: Request, res: Response) => {
    const newUser = await usersService.create(req.body.login, req.body.password)
    res.status(201).send(newUser)
})

usersRouter.get('/', async (req, res) => {
    const pageNumber = req.query.PageNumber? +req.query.PageNumber: 1
    const pageSize = req.query.PageSize? +req.query.PageSize: 10
    const users = await usersService.getUsers(pageNumber, pageSize)
    res.send(users)
})

usersRouter.delete('/:id', authMiddleware, async (req, res) => {
    const isDeleted = await usersService.delete(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})