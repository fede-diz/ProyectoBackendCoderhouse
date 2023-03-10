import { Router } from 'express'
import { getAll, getById_API, getById_RENDER, createProduct, updateProduct, deleteProduct } from '../controller/product.controller.js'

const productRouter = Router()

productRouter.get('/', getAll)
productRouter.get('/:pid', getById_API)
productRouter.get('/detail/:pid', getById_RENDER)

productRouter.post('/', createProduct)

productRouter.put('/:pid', updateProduct)

productRouter.delete('/:pid', deleteProduct)

export default productRouter


// Para no hacerlo en todos los router y que sea al pedo porque "no era así", quiero chequear que lo que había que hacer era esto