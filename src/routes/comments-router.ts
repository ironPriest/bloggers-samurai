import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";
import {commentValidation} from "./posts-router";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const commentsRouter = Router({})

commentsRouter
    // .get('/:postId', async (req, res) => {
    //     const comments = commentsService.getPostComments(req.params.postId)
    //     res.status(201).send(comments)
    // })
    .put('/:id',
        bearerAuthMiddleware,
        commentValidation,
        inputValidationMiddleware,
        async (req, res) =>{
        const isUpdated = await commentsService.updateComment(req.params.id, req.body.content)
        if (isUpdated) {
            const comment = await commentsService.getCommentById(req.params.id)
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
    .delete('/:id', bearerAuthMiddleware, async (req: Request, res: Response) => {
        const isDeleted: boolean = await commentsService.delete(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
    .get('/:id', async (req: Request, res: Response) => {
        const comment = await commentsService.getCommentById(req.params.id)
        res.status(200).send(comment)
    })