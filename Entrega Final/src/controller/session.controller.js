import config from '../config/config.js'
import passport from 'passport'
import { UserService } from '../repositories/index.js'
import CustomError from "../services/custom_error.js"
import errorTypes from '../services/enums.js'
import { generateNotAuthToManageUsersErrorInfo } from '../services/info.js'

export const registerRENDER = (req, res) => {
    res.render('sessions/register')
}

export const registerAPI = (req, res) => {
    res.redirect('/')
}

export const failRegister = (req, res) => {
    req.logger.error('Fail to register')
    res.send({ error: "Failed" })
}

export const loginRENDER = (req, res) => {
    res.render('sessions/login')
}

export const loginAPI = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Invalid credentials" })
    }

    res.cookie(config.jwtCookieName, req.user.token).redirect('/api/session/sessiontime')
}

export const sessionTimeLogin = async (req, res) => {
    const userId = req.user.user._id || req.user.user.id

    const last_session = new Date().toLocaleString()
    await UserService.update(userId, {$set: {last_session: last_session } })

    res.redirect('/api/products')
}

export const failLogin = (req, res) => {
    res.send({ error: "Fail Login" })
}

export const githubLogin = async (req, res) => {}
export const githubCallback = async (req, res) => {
    req.session.user = req.user
    req.logger.info(`User Session: ${req.session.user}`)
    res.cookie(config.jwtCookieName, req.user.token).redirect('/api/products')
}

export const currentRENDER = async (req, res) => {
    const userId = req.user.user._id || req.user.user.id
    const userToRender = await UserService.getById(userId)

    userToRender.password = null

    res.render('sessions/current', { userToRender })
}

export const switchRole = async (req, res) => {
    try {
        const userIdToSwitch = req.params.uid
        const userToSwitch = await UserService.getById(userIdToSwitch)
        const role = userToSwitch.role === "user" ? "premium" : "user";
        await UserService.update(userIdToSwitch, {$set: {role: role}})

        const user = req.user.user
        const userToRender = await UserService.getById(user._id)
        userToRender.password = null
        const users = await UserService.get()

        if (user.role === 'admin') res.render('sessions/manager', { users })
        else res.render('sessions/current', { userToRender })
    } catch (error) {
        req.logger.error(`Error switching roles: ${error}`)
        res.status(500).json({ status: 'error', message: `Error switching roles: ${error}` })
    }
}

export const logout = (req, res) => {
    res.clearCookie(config.jwtCookieName).redirect('/')
}

export const getUsers = async (req, res) => {
    const users = await UserService.get()
      
    const mappedUsers = users.map(({ first_name, last_name, email, role, last_session }) => ({ first_name, last_name, email, role, last_session }))

    res.json({ mappedUsers })
}

export const deleteSingleUser = async (req, res) => {
    const user = req.user.user

    if (user.role !== 'admin') {
        CustomError.createError({
            name: "User authorization error",
            cause: generateNotAuthToManageUsersErrorInfo(user),
            message: 'Error. Role not authorized to manage users',
            code: errorTypes.NOT_AUTH_TO_CREATE_ERROR 
        })
        res.json({ status: 'error', message: 'Role Not Authorized' })
    }

    const userToDelete = req.params.uid
    await UserService.delete(userToDelete)

    const users = await UserService.get()
    res.render('sessions/manager', { users })
}

export const deleteInactiveUsers = async (req, res) => {   
    const inactiveTimeLimit = new Date()
    inactiveTimeLimit.setDate(inactiveTimeLimit.getDate() - 2)

    const inactiveUsers = await UserService.getInactiveUsers(inactiveTimeLimit)

    inactiveUsers.forEach(async (user) => {
        await UserService.mailDelete(user._id)
    })

    res.json({ status: 'success', message: 'Inactive users eliminated' })
}

export const manageUsers = async (req, res) => {
    const user = req.user.user
    
    if (user.role !== 'admin') {
        CustomError.createError({
            name: "User authorization error",
            cause: generateNotAuthToManageUsersErrorInfo(user),
            message: 'Error. Role not authorized to manage users',
            code: errorTypes.NOT_AUTH_TO_CREATE_ERROR 
        })
        res.json({ status: 'error', message: 'Role Not Authorized' })
    }
    
    const users = await UserService.get()
    res.render('sessions/manager', { users })
}


export const authentication = {
    register: () => passport.authenticate('register', { failureRedirect: '/api/session/failregister' }),
    login: () => passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }),
    github: () => passport.authenticate('github', { scope: ['user:email'] }),
    githubRedirect: () => passport.authenticate('github', { failureRedirect: '/' })
}