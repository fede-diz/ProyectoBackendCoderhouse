import productRouter from "./router/product.router.js"
import cartRouter from "./router/cart.router.js"
import chatRouter from "./router/chat.router.js"
import sessionRouter from "./router/session.router.js"
import paymentRouter from "./router/payment.router.js"
import mockRouter from "./router/mock.router.js"
import loggerRouter from "./router/loggerRouter.js"
import { MessageService } from "./repositories/index.js"
import { passportCall } from "./utils.js"
import errorHandler from './middlewares/error.js'

const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })

    // Congfiguracion de rutas
    app.use('/api/products', passportCall('jwt'), productRouter)
    app.use('/api/carts', passportCall('jwt'), cartRouter)
    app.use('/api/mockingproducts', passportCall('jwt'), mockRouter)
    app.use('/api/chat', chatRouter)
    app.use('/api/session', sessionRouter)
    app.use('/api/payments', paymentRouter)
    app.use('/loggerTest', loggerRouter)
    
    app.use('/', (req, res) => res.redirect('/api/session/login'))
    app.use(errorHandler)

    // Configuración de Sockets
    socketServer.on("connection", socket => {
        console.log("New client connected")

        socket.on("message", async data => {
            await MessageService.create(data)
            let messages = await MessageService.get()
            socketServer.emit("logs", messages)
        })
    })
}

export default run
