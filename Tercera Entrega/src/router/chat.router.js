import { Router } from 'express'

const chatRouter = Router()

chatRouter.get('/', async (req, res) => {
    res.render('chat', {})
})

export default chatRouter