import { Router } from 'express'
import { addToCart, createCart, getCartById, getCarts, purchase, viewTickets } from '../controller/cart.controller.js'

const cartRouter = Router()

cartRouter.get('/', getCarts)
cartRouter.get('/:cid', getCartById)
cartRouter.get('/:cid/tickets', viewTickets)
cartRouter.post('/', createCart)
cartRouter.post('/:cid/products/:pid', addToCart)
cartRouter.post('/:cid/purchase', purchase)

export default cartRouter
