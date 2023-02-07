import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import mongoose from 'mongoose'
import run from "./run.js";

const app = express()

// Para traer info de POST como JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Configurar el motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// Carpeta publica
app.use(express.static(__dirname + '/public'))

// Conexión Mongo
const uri = "mongodb+srv://nico:kX5g98s1@clustertester.gziwo4f.mongodb.net/?retryWrites=true&w=majority"

mongoose.set('strictQuery', false)
mongoose.connect(uri, {
    dbName: "ecommerce"
}, error => {
    if (error) {
        console.log('No se pudo conectar a la DB');
        return
    }

    // Corriendo el servidor
    const httpServer = app.listen(8080, () => console.log('Server listening...'))
    const socketServer = new Server(httpServer)
    httpServer.on("error", (e) => console.log("ERROR: " + e))

    run(socketServer, app)
})


