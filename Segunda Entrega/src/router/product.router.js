import { Router } from 'express'
import productModel from '../dao/models/product.model.js'

const productRouter = Router()

productRouter.get('/', async (req, res) => {
    const limit = parseInt(req.query?.limit) || 10
    const page = parseInt(req.query?.page) || 1
    const filter = req.query?.filter  || ''
    const sort = req.query?.sort || ''

    const search = {}
    if(filter) {
        search.title = filter
    }

    const products = await productModel.paginate(search, {
        limit, 
        page, 
        sort: sort=='' ? '' : { price: sort},
        lean: true
    })
    
    products.prevLink = products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null
    products.nextLink = products.hasNextPage ? `/api/products?page=${products.nextPage}` : null

    console.log(JSON.stringify(products, null, 2, '\t'));
    res.render('products', { products })
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

        res.render('products', { data: products })
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
