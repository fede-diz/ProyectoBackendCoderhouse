import config from '../config/config.js'
import passport from 'passport'
import { UserService } from '../repositories/index.js'

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

    res.cookie(config.jwtCookieName, req.user.token).redirect('/api/products')
}

export const failLogin = (req, res) => {
    res.send({ error: "Fail Login" })
}

export const githubLogin = async (req, res) => { }
export const githubCallback = async (req, res) => {
    req.session.user = req.user
    req.logger.info(`User Session: ${req.session.user}`)
    res.cookie(config.jwtCookieName, req.user.token).redirect('/api/products')
}

export const currentRENDER = async (req, res) => {
    const userId = req.user.user.id
    const userToRender = await UserService.getById(userId)

    userToRender.password = null

    res.render('sessions/current', { userToRender })
}

export const switchRole = async (req, res) => {
    try {
        const user = req.user.user
        user.role = user.role === "user" ? "premium" : "user";
        const userToRender = await UserService.update(user.id, user.role)

        userToRender.password = null

        res.render('sessions/current', { userToRender })
    } catch (error) {
        req.logger.error(`Error switching roles: ${error}`)
        res.status(500).json({ status: 'error', message: `Error switching roles: ${error}` });
    }
}


export const logout = (req, res) => {
    res.clearCookie(config.jwtCookieName).redirect('/')
}


export const authentication = {
    register: () => passport.authenticate('register', { failureRedirect: '/api/session/failregister' }),
    login: () => passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }),
    github: () => passport.authenticate('github', { scope: ['user:email'] }),
    githubRedirect: () => passport.authenticate('github', { failureRedirect: '/' })
}
