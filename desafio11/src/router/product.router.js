import { Router } from 'express'
import { createProduct, getProducts, getProductById_API, getProductById_RENDER } from '../controller/product.controller.js'

const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/:pid', getProductById_API)
productRouter.get('/detail/:pid', getProductById_RENDER)
productRouter.post('/', createProduct)

export default productRouter