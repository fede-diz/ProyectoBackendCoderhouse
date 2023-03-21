import { ProductService } from '../repositories/index.js'

export const getProducts = async (req, res) => {
    const limit = parseInt(req.query?.limit) || 10
    const page = parseInt(req.query?.page) || 1
    const filter = req.query?.filter || ''
    const sort = req.query?.sort || ''

    const search = {}
    if (filter) {
        search.title = filter
    }

    const products = await ProductService.getPaginate(search, {
        limit,
        page,
        sort: sort == '' ? '' : { price: sort },
        lean: true
    })

    const user = req.user.user
    const userCart = user.cart[0].id._id || user.cart[0].id.id

    // console.log(JSON.stringify(products, null, 2, '\t'));    // Lo comenteo para que no joda en la consola

    res.render('products', { products, user, userCart })
}

export const getProductById_API = async (req, res) => {
    const idProd = req.params.pid
    const prodById = await ProductService.getById(idProd)
    
    if (!prodById) return res.status(400).json({ status: "error", error: "Product not found" })
    
    res.json({ prodById })
}

export const getProductById_RENDER = async (req, res) => {
    const idProd = req.params.pid
    const product = await ProductService.getById(idProd)

    const user = req.user.user
    const userCart = user.cart[0].id._id || user.cart[0].id.id
    
    res.render('productDetail', { product, user, userCart })
}

export const createProduct = async (req, res) => {
    const product = req.body
    const prodCode = req.body.code
    const prodDuplicated = await ProductService.getByCode(prodCode)

    // Desde postman no funciona el .post() porque no tiene token, así que creo directamente el products.json

    const user = req.user.user
    const userCart = user.cart[0].id._id || user.cart[0].id.id

    if (!prodDuplicated) {
        await ProductService.create(product)
        const products = await ProductService.get()

        res.render('products', { data: products, user, userCart})
    } else {
        return res.status(400).json({ status: "error", error: "Product Duplicated" })
    }
}

export const updateProduct = async (req, res) => {
    const idProd = req.params.pid
    const product = req.body
    const productToUpdate = await ProductService.update(idProd, product)

    res.json({ status: 'success', message: 'Product updated!', productToUpdate })
}