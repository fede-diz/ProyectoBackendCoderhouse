import { Router } from 'express'
import productModel from '../dao/models/product.model.js'

const oneProductRouter = Router()

oneProductRouter.get('/:pid', async (req, res) => {
    const idProd = req.params.pid
    const product = await productModel.findById(idProd)

    res.render('oneProduct', product)
})

export default oneProductRouter
