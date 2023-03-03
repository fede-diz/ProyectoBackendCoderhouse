import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import userModel from '../dao/models/user.model.js'
import cartModel from '../dao/models/cart.model.js'
import { JWT_PRIVATE_KEY } from './credentials.js'
import { createHash, isValidPassword, generateToken, cookieExtractor } from '../utils.js'

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {

    // Estrategia Local - Registro
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age } = req.body
        try {
            const user = await userModel.findOne({email: username})
            if(user) {
                console.log("User already exits");
                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: [],
                role: email == 'adminCoder@coder.com' ? 'admin' : 'user'
            }
            const newCart = await cartModel.create({})
            newUser.cart.push({id: newCart})

            const generatedUser = await userModel.create(newUser)
            
            return done(null, generatedUser)
        } catch (error) {
            return done('Error al obtener user ' + error)
        }
    }))

    // Estrategia Local - Login
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({email: username})
            if(!user) {
                console.log("User doesn't exist")
                return done(null, user)                                 
            }

            if(!isValidPassword(user, password)) {
                console.log('Incorrect Password')
                return done(null, false)
            }

            const token = generateToken(user)
            user.token = token

            return done(null, user)
        } catch (error) {
            return done("Error al iniciar sesión " + error)
        }
    }))

    // Estrategia Github
    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.1231aa3af4b6d534",
        clientSecret: "93840b0c4984ecd8756d89844e93f5dc0a06892d",
        callbackURL: "http://127.0.0.1:8080/api/session/githubcallback"
    }, async(accessToken, refreshToken, profile, done) => {
        //console.log(profile);

        try {
            const user = await userModel.findOne({email: profile._json.email})

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
                role: profile._json.email == 'adminCoder@coder.com' ? 'admin' : 'user'
            }
            const newCart = await cartModel.create({})
            newUser.cart.push({id: newCart})

            const generatedUser = await userModel.create(newUser)

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
        secretOrKey: JWT_PRIVATE_KEY
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport