import { Router } from 'express'
import { createPreference, feedback } from '../controller/payment.controller.js'

const paymentRouter = Router()

paymentRouter.post("/create_preference", createPreference)
paymentRouter.get('/feedback', feedback)

export default paymentRouter