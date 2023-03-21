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
    
    res.cookie(config.jwtCookieName, req.user.token).redirect('/api/products')
}

export const failLogin = (req, res) => {
    res.send({error: "Fail Login"})
}

export const githubLogin = async (req, res) => {}
export const githubCallback = async (req, res) => {
    req.session.user = req.user
    console.log('User Session: ', req.session.user)
    res.cookie(config.jwtCookieName, req.user.token).redirect('/api/products')
}

export const currentRENDER = async (req, res) => { 
    const userId = req.user.user._id || req.user.user.id
    const userToRender = await UserService.getById(userId)
    
    // Para no mandar el password (o lo que sea que se considere información sensible) tengo que:
    // 1- Hacer esto de la línea 51?
    // 2- O sacarle el atributo password al DTO? Entiendo que no, porque sino cada vez que creo un usuario le eliminaría el password
    // 3- O crear un InfoUserDTO sin el password? Y en lugar de usar la línea 44 con "UserService.getById()" uso este "InfoUserDTO(req.user.user)" que no lleve password
    // 4- Le creo al Service una función que se llama tipo "cleanInfo" dentro del user.repository.js y le saco el password como en la línea 51 pero ahí adentro del repository?
    userToRender.password = null
    
    res.render('sessions/current', { userToRender })
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
