import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,       // Esto sólo se usa dentro de mongoose y hace referencia a un id
                ref: "products"                             // con esta referencia, que es el nombre de la colección a la que refiero
            },
            quantity: Number
        }],
        default: []         // Cuando creás un carrito nuevo, te crea un array vacío
    }
})

cartSchema.pre('find', function() {
    this.populate('products.id')
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel