import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import initializePassport from './config/passport.config.js'
import __dirname from './utils.js'
import run from "./run.js";

const app = express()

// Para traer info de POST como JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Carpeta publica
app.use(express.static(__dirname + '/public'))

// Extracción de la info de la cookie
app.use(cookieParser())

//Configurar el motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// Configuración de sesiones
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}))

// Configuración de Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Corriendo el servidor
const httpServer = app.listen(8080, () => console.log('Server listening...'))
const socketServer = new Server(httpServer)
httpServer.on("error", (e) => console.log("ERROR: " + e))

run(socketServer, app)
