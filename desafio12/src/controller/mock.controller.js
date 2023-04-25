import { generateProducts } from '../utils.js'

export const mockProducts = async (req, res) => {
    const user = req.user.user
    const products = []
    
    for (let i = 0; i < 100; i++) {
        products.push(generateProducts())
    }
    
    res.render('mockingProducts', { products, user })
}