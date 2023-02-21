import { Router } from 'express'
import userModel from '../dao/models/user.model.js'

const sessionRouter = Router()

//Vista - Crear usuarios
sessionRouter.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API - Crear usuarios (en DB)
sessionRouter.post('/register', async(req, res) => {
    const userNew = req.body
    if (userNew.email == 'adminCoder@coder.com') userNew.role = 'admin'
    else userNew.role = 'user'

    const user = new userModel(userNew)
    await user.save()

    res.redirect('/session/login')
})

// Vista - Login
sessionRouter.get('/login', (req, res) => {
    res.render('sessions/login')
})

// API - Login
sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({email, password}).lean().exec()           // find y findOne van siempre con .lean().exec() para traerlo en formato JSON
    if(!user) {
        return res.status(401).render('errors/base', {
            error: 'Error en email y/o password'
        })
    }

    req.session.user = user
    res.redirect('/api/products')
})

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