import { Router } from 'express'
import { addToCart, createCart, deleteCart, deleteProdFromCart, getCartById, getCarts, updateCart, updateProdFromCart } from '../controller/cart.controller.js'

const cartRouter = Router()

cartRouter.get('/', getCarts)
cartRouter.get('/:cid', getCartById)
cartRouter.post('/', createCart)
cartRouter.post('/:cid/products/:pid', addToCart)
cartRouter.put('/:cid', updateCart)
cartRouter.put('/:cid/products/:pid', updateProdFromCart)
cartRouter.delete('/:cid', deleteCart)
cartRouter.delete('/:cid/products/:pid', deleteProdFromCart)

export default cartRouter
