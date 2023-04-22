import { Router } from 'express'

const loggerRouter = Router()

loggerRouter.get('/', (req, res) => {
    req.logger.fatal('Falla mortal 3: La venganza')
    req.logger.error('Error gravísimo. No atienden el celular')
    req.logger.warning('Advertencia sutil. Si no amaga a pagar...no es por ahí')
    req.logger.info('Información irrelevante: El olor a pasto cortado es el pasto pidiendo ayuda a gritos')
    req.logger.http('Protocolo que dice...algo')
    req.logger.debug('Estoy debuggeando...por favor guardar silencio en la sala')
    res.json({ message: 'Logger Test'})
})

export default loggerRouter
