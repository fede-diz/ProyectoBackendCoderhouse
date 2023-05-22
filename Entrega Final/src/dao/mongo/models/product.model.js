import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnail: String,
    owner: String
})

productSchema.plugin(mongoosePaginate)
const ProductModel = mongoose.model(productCollection, productSchema)

export default ProductModel