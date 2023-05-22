import { Router } from 'express'
import { passportCall } from '../utils.js'
import { authentication, currentRENDER, deleteInactiveUsers, deleteSingleUser, failLogin, failRegister, getUsers, githubCallback, githubLogin, loginAPI, loginRENDER, logout, manageUsers, registerAPI, registerRENDER, sessionTimeLogin, switchRole } from '../controller/session.controller.js'

const sessionRouter = Router()

// Register
sessionRouter.get('/register', registerRENDER)
sessionRouter.post('/register', authentication.register(), registerAPI)
sessionRouter.get('/failregister', failRegister)

// Login
sessionRouter.get('/login', loginRENDER)
sessionRouter.post('/login', authentication.login(), loginAPI)
sessionRouter.get('/sessiontime', passportCall('jwt'), sessionTimeLogin)
sessionRouter.get('/faillogin', failLogin)

// Github
sessionRouter.get('/github', authentication.github(), githubLogin)
sessionRouter.get('/githubcallback', authentication.githubRedirect(), githubCallback)

// Current
sessionRouter.get('/current', passportCall('jwt'), currentRENDER)

// Logout
sessionRouter.get('/logout', logout)

// Users Management
sessionRouter.get('/premium/:uid', passportCall('jwt'), switchRole)
sessionRouter.get('/', passportCall('jwt'), getUsers)
sessionRouter.get('/delete/:uid', passportCall('jwt'), deleteSingleUser)
sessionRouter.get('/deleteInactive', passportCall('jwt'), deleteInactiveUsers)
sessionRouter.get('/usersmanagement', passportCall('jwt'), manageUsers)

export default sessionRouter