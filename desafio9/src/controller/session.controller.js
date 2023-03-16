import { JWT_COOKIE_NAME } from '../config/credentials.js'

export const registerRENDER = (req, res) => {
    res.render('sessions/register')
}

export const registerAPI = (req, res) => {
    res.redirect('/')
}

export const failRegister = (req, res) => {
    console.log('Fail Strategy');
    res.send({ error: "Failed" })
}

export const loginRENDER = (req, res) => {
    res.render('sessions/login')
}

export const loginAPI = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Invalid credentials" })
    }
    
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/api/products')
}

export const failLogin = (req, res) => {
    res.send({error: "Fail Login"})
}

export const githubLogin = async (req, res) => {}
export const githubCallback = async (req, res) => {
    req.session.user = req.user
    console.log('User Session: ', req.session.user)
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/api/products')
}

export const currentRENDER = (req, res) => {
    const user = req.user.user
    
    res.render('sessions/current', { user })
}

export const logout = (req, res) => {
    res.clearCookie(JWT_COOKIE_NAME).redirect('/')
}