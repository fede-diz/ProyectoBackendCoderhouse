import { Router } from 'express'
import productModel from '../dao/models/product.model.js'

const viewsRouter = Router()

viewsRouter.get('/', async (req, res) => {
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
    
    products.prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}` : null
    products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}` : null

    console.log(JSON.stringify(products, null, 2, '\t'));
    res.render('views', { products })
})

viewsRouter.get('/detail/:pid', async (req, res) => {
    const idProd = req.params.pid
    const product = await productModel.findById(idProd)

    res.render('detail', product)
})

export default viewsRouter
