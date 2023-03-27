import ProductModel from "./models/product.model.js"

export default class Product {
    constructor() {}

    get = async () => {
        return await ProductModel.find().lean().exec()
    }

    getById = async (id) => {
        return await ProductModel.findById(id).lean().exec()
    }

    getByCode = async (code) => {
        return await ProductModel.findOne({ code }).lean().exec()
    }

    getPaginate = async (search, options) => {
        return await ProductModel.paginate(search, options)
    }

    create = async (data) => {
        return await ProductModel.create(data)
    }

    update = async (id, update) => {
        return await ProductModel.updateOne({ _id: id }, update)
    }
}