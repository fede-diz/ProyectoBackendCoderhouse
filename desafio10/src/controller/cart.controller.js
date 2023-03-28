import { CartService, TicketService, ProductService, UserService } from '../repositories/index.js'

export const getCarts = async (req, res) => {
    const carts = await CartService.get()

    res.json({ carts })
}

export const getCartById = async (req, res) => {
    const idCart = req.params.cid
    const user = req.user.user
    const cartById = await CartService.getById(idCart)

    res.render('cartDetail', { cart: cartById, user, userCart: idCart })
}

export const createCart = async (req, res) => {
    try {
        const newCart = await CartService.create({})
        res.json({ status: 'success', message: newCart })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 'error', message: 'Failed to create cart' })
    }
}

export const addToCart = async (req, res) => {
    try {
        const idCart = req.params.cid
        const idProd = req.params.pid
        const user = req.user.user
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

        res.render('cartDetail', { cart: cartUpdated, user, userCart: idCart })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 'error', message: 'Failed to add the product to the cart' })
    }
}

export const purchase = async (req, res) => {
    try {
        const idCart = req.params.cid
        const user = req.user.user
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
            user.ticket.push({ id: userTicket })
        }

        res.render('cartDetail', { cart: newCart, user, userCart: idCart })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
}

export const viewTickets = async (req, res) => {

}