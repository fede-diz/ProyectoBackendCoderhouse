import { Router } from 'express'
import productModel from '../dao/models/product.model.js'

const productRouter = Router()

productRouter.get('/', async (req, res) => {
    const products = await productModel.find().lean().exec()
    const limit = req.query.limit

    if (limit) {
        const limitedArray = products.slice(0, limit)
        res.render('home', { data: limitedArray })
    } else {
        res.render('home', {data: products })
    }
})

productRouter.get('/:pid', async (req, res) => {
    const idProd = req.params.pid
    const prodById = await productModel.findOne({_id: idProd})

    if (!prodById) return res.status(400).json({status: "error", error: "Product not found"})

    res.json({ prodById })
})

productRouter.post('/', async (req, res) => {
    const product = req.body
    const prodCode = req.body.code
    const prodDuplicated = await productModel.findOne({code: prodCode})

    if (!prodDuplicated) {
        await productModel.create(product)
        const products = await productModel.find().lean().exec()

        res.render('home', { data: products })
    } else {
        return res.status(400).json({status: "error", error: "Product Duplicated"})
    }
})

productRouter.put('/:pid', async (req, res) => {
    const idProd = req.params.pid
    const product = req.body
    const productToUpdate = await productModel.updateOne({_id: idProd}, product)

    res.json({status: 'success', message: 'Product updated!', productToUpdate})
})

productRouter.delete('/:pid', async (req, res) => {
    const idProd = req.params.pid
    const productToDelete = await productModel.deleteOne({_id: idProd})

    res.json({status: 'success', message: 'Product deleted!', productToDelete})
})

export default productRouter
