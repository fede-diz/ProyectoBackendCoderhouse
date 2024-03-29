import cartModel from '../dao/models/cart.model.js'

export const getCarts = async (req, res) => {
    const carts = await cartModel.find().lean().exec()
    
    res.json({ carts })
}

export const getCartById = async (req, res) => {
    const idCart = req.params.cid
    const cartById = await cartModel.findOne({_id: idCart}).lean().exec()
    
    const user = req.user.user
    const userCart = user.cart[0].id._id
    
    res.render('cartDetail', { cart: cartById, user, userCart })
}

export const createCart = async (req, res) => {
    const newCart = await cartModel.create({})

    res.json({ status: 'success', message: newCart })
}

export const addToCart = async (req, res) => {
    const idCart = req.params.cid
    const idProd = req.params.pid
    const quantity = req.body.quantity || 1
    const cart = await cartModel.findById(idCart).lean().exec()

    let prodInCart = false
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].id == idProd) {
            cart.products[i].quantity++
            prodInCart = true
            break
        }
    }

    if (prodInCart == false) cart.products.push({ id: idProd, quantity})
    await cartModel.updateOne({_id: idCart}, cart)
    const cartUpdated = await cartModel.findById(idCart).lean().exec()

    const user = req.user.user
    const userCart = user.cart[0].id._id

    res.render('cartDetail', { cart: cartUpdated, user, userCart })
}

export const updateCart = async (req, res) => {
    const idCart = req.params.cid
    const newCart = req.body
    const cartUpdated = await cartModel.updateOne({_id: idCart}, newCart)

    res.json({status: 'success', message: 'Cart updated!', cartUpdated})
}

export const updateProdFromCart = async (req, res) => {
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
}

export const deleteCart = async (req, res) => {
    const idCart = req.params.cid
    const cart = await cartModel.findById(idCart)

    cart.products = []
    await cart.save()

    res.json({status: 'success', message: 'Cart emptied!'})
}

export const deleteProdFromCart = async (req, res) => {
    const idCart = req.params.cid
    const idProd = req.params.pid

    const cart = await cartModel.findById(idCart)
    if(!cart) return res.status(404).json({status: 'error', error: 'Cart Not Found'})

    const prodIndex = cart.products.findIndex(prod => prod.id == idProd)
    if (prodIndex < 0) return res.status(404).json({status: 'error', error: 'Product Not Found on Cart'})

    cart.products.splice(prodIndex, 1)
    await cart.save()
    
    res.json({status: 'success', message: 'Product deleted from Cart', cart})
}
