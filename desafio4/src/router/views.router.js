import { Router } from 'express'
import ProductsManager from '../productsManager.js'

const viewsRouter = Router()
const productsManager = new ProductsManager('./productos.json')

viewsRouter.get('/', async (req, res) => {
    const products = await productsManager.getProducts()

    res.render('home', {
        products: products,
        style: 'index.css',
        title: "Desafio CODER"
    })
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const products = await productsManager.getProducts()

    res.render('realTimeProducts', {
        products: products,
        style: 'index.css',
        title: "Desafio CODER"
    })
})

// viewsRouter.post('/realtimeproducts', async (req, res) => {
//     const socketMiddle = req.io
//     const socket = io()

//     socketMiddle.on('msg_all_add', (data) => {
//         console.log('Producto Agregado:')
//         console.log(data)
//     })

//     // await productsManager.addProduct(data)
//     const products = await productsManager.getProducts()

//     res.render('realTimeProducts', {
//         products: products,
//         style: 'index.css',
//         title: "Desafio CODER"
//     })
// })

export default viewsRouter
