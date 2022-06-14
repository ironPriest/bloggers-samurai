import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";

const app = express()
const port = process.env.PORT || 3003
app.use(cors())
const parserMiddleware = bodyParser.json()
app.use(parserMiddleware)

app.use('/bloggers', bloggersRouter)

app.use('/posts', postsRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
