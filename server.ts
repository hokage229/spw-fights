import express from 'express'

const server = express()

server.all("/", (req, res) => {
    res.send("bot is running")
})

const keepAlive = () => {
    server.listen(3000, () => {
        console.log("server is ready")
    })
}
export default {keepAlive}