import CartModel from "./models/cart.model.js"

export default class Cart {
    constructor() {}

    get = async() => {
        return await CartModel.find().lean().exec()
    }

    getById = async(id) => {
        return await CartModel.findById(id).lean().exec()
    }

    create = async(data) => {
        return await CartModel.create(data)
    }

    update = async(id, update) => {
        return await CartModel.updateOne({ _id: id }, update)
    }
}