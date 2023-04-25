import { Router } from 'express'
import { passportCall } from '../utils.js'
import { authentication, currentRENDER, failLogin, failRegister, githubCallback, githubLogin, loginAPI, loginRENDER, logout, registerAPI, registerRENDER, switchRole } from '../controller/session.controller.js'

const sessionRouter = Router()

// Register
sessionRouter.get('/register', registerRENDER)
sessionRouter.post('/register', authentication.register(), registerAPI)
sessionRouter.get('/failregister', failRegister)

// Login
sessionRouter.get('/login', loginRENDER)
sessionRouter.post('/login', authentication.login(), loginAPI)
sessionRouter.get('/faillogin', failLogin)

// Github
sessionRouter.get('/github', authentication.github(), githubLogin)
sessionRouter.get('/githubcallback', authentication.githubRedirect(), githubCallback)

// Current
sessionRouter.get('/current', passportCall('jwt'), currentRENDER)

// Switch Role
sessionRouter.put('/premium/:uid', switchRole)

// Logout
sessionRouter.get('/logout', logout)

export default sessionRouter