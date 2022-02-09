import express, {Request, Response} from 'express'

const server = express()

server.all("/", (req: Request, res: Response) => {
    res.send("bot is running")
})

const port = process.env.PORT || 5000
const keepAlive = () => {
    server.listen(port, () => {
        console.log("server is ready")
    })
}
export default {keepAlive}
