import productRouter from "./router/product.router.js"
import cartRouter from "./router/cart.router.js"
import chatRouter from "./router/chat.router.js"
import sessionRouter from "./router/session.router.js";
import messageModel from "./dao/models/message.model.js";
import { passportCall } from "./utils.js";

const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })

    // Congfiguracion de rutas
    app.use('/api/products', passportCall('jwt'), productRouter)
    app.use('/api/carts', passportCall('jwt'), cartRouter)
    app.use('/api/chat', chatRouter)

    app.use('/api/session', sessionRouter)

    app.use('/', (req, res) => res.redirect('/api/session/login'))

    // Configuración de Sockets
    socketServer.on("connection", socket => {
        console.log("New client connected")

        socket.on("message", async data => {
            await messageModel.create(data)
            let messages = await messageModel.find().lean().exec()
            socketServer.emit("logs", messages)
        })
    })
}

export default run
