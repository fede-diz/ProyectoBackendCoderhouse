import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import userModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'

const LocalStrategy = local.Strategy

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
                password: createHash(password)
            }
            if (newUser.email == 'adminCoder@coder.com') newUser.role = 'admin'
            else newUser.role = 'user'

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
        console.log(profile);

        try {
            const user = await userModel.findOne({email: profile._json.email})
            if(user) return done(null, user)

            const newUser = await userModel.create({
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                password: ""
            })
            if (newUser.email == 'adminCoder@coder.com') newUser.role = 'admin'
            else newUser.role = 'user'

            return done(null, newUser)
        } catch (error) {
            return done('Error to login with github' + error)
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