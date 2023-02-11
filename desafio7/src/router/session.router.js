import { Router } from 'express'
import passport from 'passport'  

const sessionRouter = Router()

//Vista - Crear usuarios
sessionRouter.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API - Crear usuarios (en DB)
sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: '/session/failregister' }), async (req, res) => {
    res.redirect('/session/login')
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
sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/session/faillogin' }), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Invalid credentials" })
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }

    res.redirect('/products')
})
sessionRouter.get('/faillogin', (req, res) => {
    res.send({error: "Fail Login"})
})

// GITHUB - Login
sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async(req, res) => {})

sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {
        console.log('Callback: ', req.user)

        req.session.user = req.user
        console.log('User Session: ', req.session.user)
        res.redirect('/products')
    }
)

// Cerrar Session
sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.status(500).render('errors/base', {error: err})
        } else res.redirect('/session/login')
    })
})

export default sessionRouter