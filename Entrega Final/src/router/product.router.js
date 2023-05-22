import { Router } from 'express'
import { createProduct, getProducts, getProductById_API, getProductById_RENDER, updateProduct, deleteProduct } from '../controller/product.controller.js'

const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/:pid', getProductById_API)
productRouter.get('/detail/:pid', getProductById_RENDER)
productRouter.post('/', createProduct)
productRouter.put('/:pid', updateProduct)
productRouter.delete('/:pid', deleteProduct)

export default productRouter