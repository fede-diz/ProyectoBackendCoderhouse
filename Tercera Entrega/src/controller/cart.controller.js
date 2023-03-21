import { CartService, TicketService, ProductService } from '../repositories/index.js'

export const getCarts = async (req, res) => {
    const carts = await CartService.get()

    res.json({ carts })
}

export const getCartById = async (req, res) => {
    const idCart = req.params.cid
    const cartById = await CartService.getById(idCart)

    const user = req.user.user
    const userCart = user.cart[0].id._id || user.cart[0].id.id

    res.render('cartDetail', { cart: cartById, user, userCart })
}

export const createCart = async (req, res) => {
    const newCart = await CartService.create({})

    res.json({ status: 'success', message: newCart })
}

export const addToCart = async (req, res) => {
    const idCart = req.params.cid
    const idProd = req.params.pid
    const quantity = req.body.quantity || 1
    const cart = await CartService.getById(idCart)

    let prodInCart = false
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].id == idProd) {
            cart.products[i].quantity++
            prodInCart = true
            break
        }
    }

    if (prodInCart == false) cart.products.push({ id: idProd, quantity })
    await CartService.update(idCart, cart)
    const cartUpdated = await CartService.getById(idCart)

    const user = req.user.user
    const userCart = user.cart[0].id._id || user.cart[0].id.id

    res.render('cartDetail', { cart: cartUpdated, user, userCart })
}

export const purchase = async (req, res) => {
    const idCart = req.params.cid
    const user = req.user.user
    const userCart = user.cart[0].id._id || user.cart[0].id.id
    const cart = await CartService.getById(idCart)

    let newCart = []
    let ticketAmount = 0

    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].id.stock < cart.products[i].quantity) {
            newCart.push(cart.products[i])
            console.log("Not enough stock: " + cart.products[i].title);
        } else {
            ticketAmount += cart.products[i].quantity * cart.products[i].id.price

            const newStock = cart.products[i].id.stock - cart.products[i].quantity
            cart.products[i].id.stock = newStock
            await ProductService.update(cart.products[i].id._id, cart.products[i].id)
        }
    }

    await CartService.update(idCart, newCart)

    if (ticketAmount != 0) {
        const ticket = {
            code: Math.floor(Math.random() * 10000 + 1),
            purchase_dateTime: new Date().toLocaleString(),
            amount: ticketAmount,
            purchaser: user.email
        }
        const userTicket = await TicketService.create(ticket)
        console.log(userTicket);
        user.tickets.push({ id: userTicket._id, userTicket })
    }

    res.render('cartDetail', { cart: newCart, user, userCart })
}

export const viewTickets = async (req, res) => {
    const idCart = req.params.cid
    const user = req.user.user

    console.log(user);

    res.render('tickets', { user, userCart: idCart })
}