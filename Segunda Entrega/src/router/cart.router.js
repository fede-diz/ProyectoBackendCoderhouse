import { Router } from 'express'
import cartModel from '../dao/models/cart.model.js'

const cartRouter = Router()

cartRouter.get('/', async (req, res) => {
    const carts = await cartModel.find().lean().exec()

    res.json({ carts })
})

cartRouter.get('/:cid', async (req, res) => {
    const idCart = req.params.cid
    const cartById = await cartModel.findOne({_id: idCart})

    res.json({ cartById })
})

cartRouter.post('/', async (req, res) => {
    const newCart = await cartModel.create({})

    res.json({ status: 'success', message: newCart })
})

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const idCart = req.params.cid
    const idProd = req.params.pid
    const quantity = req.body.quantity || 1
    const cart = await cartModel.findById(idCart)

    let prodInCart = false
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].id == idProd) {
            cart.products[i].quantity++
            prodInCart = true
            break
        }
    }

    if (prodInCart == false) cart.products.push({ id: idProd, quantity})

    await cart.save()

    res.json({status: 'success', message: 'Product Added to Cart!', cart})
})

cartRouter.put('/:cid', async (req, res) => {
    const idCart = req.params.cid
    const newCart = req.body
    const cartUpdated = await cartModel.updateOne({_id: idCart}, newCart)

    res.json({status: 'success', message: 'Cart updated!', cartUpdated})
})

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const idCart = req.params.cid
    const idProd = req.params.pid
    const newQuantity = req.body

    const cart = await cartModel.findById(idCart)
    const prodIndex = cart.products.findIndex(prod => prod.id == idProd)
    const prodToUpdate = cart.products[prodIndex]

    prodToUpdate.quantity = newQuantity.quantity
    cart.products.splice(prodIndex, 1, prodToUpdate)
    await cart.save()

    res.json({status: 'success', message: 'Quantity updated!', prodToUpdate})
})

cartRouter.delete('/:cid', async (req, res) => {
    const idCart = req.params.cid
    const cart = await cartModel.findById(idCart)

    cart.products = []
    await cart.save()

    res.json({status: 'success', message: 'Cart emptied!'})
})

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const idCart = req.params.cid
    const idProd = req.params.pid

    const cart = await cartModel.findById(idCart)
    if(!cart) return res.status(404).json({status: 'error', error: 'Cart Not Found'})

    const prodIndex = cart.products.findIndex(prod => prod.id == idProd)
    if (prodIndex < 0) return res.status(404).json({status: 'error', error: 'Product Not Found on Cart'})

    cart.products.splice(prodIndex, 1)
    await cart.save()
    
    res.json({status: 'success', message: 'Product deleted from Cart', cart})
})

export default cartRouter
