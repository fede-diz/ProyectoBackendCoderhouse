import { Router } from 'express'
import passport from 'passport'
import { passportCall } from '../utils.js'
import { currentRENDER, failLogin, failRegister, githubCallback, githubLogin, loginAPI, loginRENDER, logout, registerAPI, registerRENDER } from '../controller/session.controller.js'

const sessionRouter = Router()

// Register
sessionRouter.get('/register', registerRENDER)
sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failregister' }), registerAPI)
sessionRouter.get('/failregister', failRegister)

// Login
sessionRouter.get('/login', loginRENDER)
sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), loginAPI)
sessionRouter.get('/faillogin', failLogin)

// Github
sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), githubLogin)
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/'}), githubCallback)

// Current
sessionRouter.get('/current', passportCall('jwt'), currentRENDER)

// Logout
sessionRouter.get('/logout', logout)

export default sessionRouter