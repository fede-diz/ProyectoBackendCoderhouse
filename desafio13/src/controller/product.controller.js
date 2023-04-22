import { ProductService } from '../repositories/index.js'
import CustomError from "../services/custom_error.js"
import errorTypes from '../services/enums.js'
import { generateDuplicatedErrorInfo, generateIdErrorInfo } from '../services/info.js'

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
    
    if (!prodById) {
        CustomError.createError({
            name: "Product fetch error",
            cause: generateIdErrorInfo(idProd),
            message: 'Error trying to find product by ID',
            code: errorTypes.ID_NOT_FOUND_ERROR
        })
        es.json({ status: 'error', message: 'Product not found' })
    }
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
    
    const user = req.user.user
    const userCart = user.cart[0].id._id || user.cart[0].id.id
    
    if (!prodDuplicated) {
        await ProductService.create(product)
        const products = await ProductService.get()
        
        res.render('products', { data: products, user, userCart})
    } else {
        CustomError.createError({
            name: "Product creation error",
            cause: generateDuplicatedErrorInfo(prodDuplicated),
            message: 'Error due to duplicated Product Code',
            code: errorTypes.DUPLICATED_CODE_ERROR
        })
        res.json({ status: 'error', message: 'Duplicated Code Product' })
    }
}

export const updateProduct = async (req, res) => {
    const idProd = req.params.pid
    const product = req.body
    const productToUpdate = await ProductService.update(idProd, product)

    res.json({ status: 'success', message: 'Product updated!', productToUpdate })
}