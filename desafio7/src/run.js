import productRouter from "./router/product.router.js"
import cartRouter from "./router/cart.router.js"
import chatRouter from "./router/chat.router.js"
import messageModel from "./dao/models/message.model.js";
import viewsRouter from "./router/views.router.js";
import sessionRouter from "./router/session.router.js";

const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })

    // Congfiguracion de rutas
    app.use('/api/products', productRouter)
    app.use('/api/carts', cartRouter)
    app.use('/api/chat', chatRouter)

    app.use('/products', viewsRouter)
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