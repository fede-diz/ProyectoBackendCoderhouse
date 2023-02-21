import { Router } from 'express'
import cartModel from '../dao/models/cart.model.js'

const oneCartRouter = Router()

oneCartRouter.get('/:cid', async (req, res) => {
    const idCart = req.params.cid
    const cartById = await cartModel.findOne({_id: idCart})

    console.log(cartById.products[1].id.title);
    res.render('oneCart', { cartById })
})

export default oneCartRouter
