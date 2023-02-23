import { Router } from 'express'
import passport from 'passport'
import { JWT_COOKIE_NAME } from '../config/credentials.js'
import { passportCall } from '../utils.js'

const sessionRouter = Router()

// Vista - Crear usuarios
sessionRouter.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API - Crear usuarios (en DB)
sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failregister' }), async (req, res) => {
    res.redirect('/')
})
sessionRouter.get('/failregister', (req, res) => {
    console.log('Fail Strategy');
    res.send({ error: "Failed" })
})

// Vista - Login
sessionRouter.get('/login', (req, res) => {
    res.render('sessions/login')
})

// API - Login
sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Invalid credentials" })
    }

    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/api/products')
})
sessionRouter.get('/faillogin', (req, res) => {
    res.send({error: "Fail Login"})
})

// Vista - Current
sessionRouter.get('/current', passportCall('jwt'), async (req, res) => {
    const user = req.user.user

    res.render('sessions/current', { user })
})

// Cerrar Session
sessionRouter.get('/logout', (req, res) => {
    res.clearCookie(JWT_COOKIE_NAME).redirect('/')
})

export default sessionRouter