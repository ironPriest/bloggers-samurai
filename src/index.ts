import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";

import {runDb} from "./repositories/db";



const app = express()
const port = process.env.PORT || 5000
app.use(cors())
const parserMiddleware = bodyParser.json()
app.use(parserMiddleware)

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()