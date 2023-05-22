import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import config from './config.js'
import { createHash, isValidPassword, generateToken, cookieExtractor } from '../utils.js'
import { UserService, CartService } from '../repositories/index.js'

// JWT
const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

// GITHUB
const clientID = "Iv1.1231aa3af4b6d534"
const clientSecret = "93840b0c4984ecd8756d89844e93f5dc0a06892d"
const callbackURL = "http://127.0.0.1:8080/api/session/githubcallback"

const initializePassport = () => {
    // Estrategia Local - Registro
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age } = req.body
        try {
            const user = await UserService.getByEmail(username)
            if(user) {
                req.logger.warning("User already exist")
                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role: email == 'adminCoder@coder.com' ? 'admin' : 'user',
                last_session: new Date().toLocaleString(),
                cart: [],
                tickets: []
            }
            const newCart = await CartService.create({})
            newUser.cart.push({id: newCart})

            const generatedUser = await UserService.create(newUser)
            
            return done(null, generatedUser)
        } catch (error) {
            return done(`Error al obtener user ${error}`)
        }
    }))

    // Estrategia Local - Login
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await UserService.getByEmail(username)
            if(!user) {
                req.logger.warning("User doesn't exist")
                return done(null, user)                                 
            }

            if(!isValidPassword(user, password)) {
                req.logger.warning("Incorrect Password")
                return done(null, false)
            }
           
            const token = generateToken(user)
            user.token = token

            return done(null, user)
        } catch (error) {
            return done(`Error al iniciar sesión ${error}`)
        }
    }))

    // Estrategia Github
    passport.use('github', new GitHubStrategy({
        clientID,
        clientSecret,
        callbackURL
    }, async(accessToken, refreshToken, profile, done) => {
        //console.log(profile);

        try {
            const user = await UserService.getByEmail(profile._json.email)

            if(user) {
                const tokenExistingUser = generateToken(user)
                user.token = tokenExistingUser

                return done(null, user)
            }

            const newUser = {
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                password: "",
                cart: [],
                role: profile._json.email == 'adminCoder@coder.com' ? 'admin' : 'user',
                tickets: []
            }
            const newCart = await CartService.create({})
            newUser.cart.push({id: newCart})

            const generatedUser = await UserService.create(newUser)

            const tokenNewUser = generateToken(generatedUser)
            generatedUser.token = tokenNewUser

            return done(null, generatedUser)
        } catch (error) {
            return done('Error to login with Github' + error)
        }
    }))

    // Estrategia JWT
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwtPrivateKey
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        const userID = user._id || user.id
        done(null, userID)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await UserService.getById(id)
        done(null, user)
    })
}

export default initializePassport