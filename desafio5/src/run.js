import productRouter from "./router/product.router.js"
import cartRouter from "./router/cart.router.js"
import chatRouter from "./router/chat.router.js"
import messageModel from "./dao/models/message.model.js";
//import productViewsRouter from './router/products.views.router.js'

const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })

    // Congfiguracion de rutas
    app.use('/api/products', productRouter)
    app.use('/api/carts', cartRouter)
    app.use('/api/chat', chatRouter)
    app.use('/', (req, res) => res.send('Funcionando'))

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
