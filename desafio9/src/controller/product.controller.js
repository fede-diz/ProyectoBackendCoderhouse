import productModel from '../dao/models/product.model.js'

export const getAll = async (req, res) => {
    const limit = parseInt(req.query?.limit) || 10
    const page = parseInt(req.query?.page) || 1
    const filter = req.query?.filter || ''
    const sort = req.query?.sort || ''

    const search = {}
    if (filter) {
        search.title = filter
    }

    const products = await productModel.paginate(search, {
        limit,
        page,
        sort: sort == '' ? '' : { price: sort },
        lean: true
    })

    const user = req.user.user
    const userCart = user.cart[0].id._id

    // console.log(JSON.stringify(products, null, 2, '\t'));    // Lo comenteo para que no joda en la consola
    
    // opción 1 =
    res.render('products', { products, user, userCart })
    
    // opción 2 =
    // return {
    //     products,
    //     user,
    //     userCart
    // }

    // opción 3 =
    // res.json({ products, user, userCart })
}

export const getById_API = async (req, res) => {
    const idProd = req.params.pid
    const prodById = await productModel.findOne({ _id: idProd })
    
    if (!prodById) return res.status(400).json({ status: "error", error: "Product not found" })
    
    res.json({ prodById })
}

// ver si funciona sólo la de arriba (getById_API), si le agrego el .lean().exec() para renderizar, y sólo cambio el endpoint en el router
export const getById_RENDER = async (req, res) => {
    const idProd = req.params.pid
    const product = await productModel.findById(idProd).lean().exec()
    
    const user = req.user.user
    const userCart = user.cart[0].id._id
    
    res.render('productDetail', { product, user, userCart })
}

export const createProduct = async (req, res) => {
    const product = req.body
    const prodCode = req.body.code
    const prodDuplicated = await productModel.findOne({ code: prodCode })

    const user = req.user.user
    const userCart = user.cart[0].id._id

    if (!prodDuplicated) {
        await productModel.create(product)
        const products = await productModel.find().lean().exec()

        res.render('products', { data: products, user, userCart})
    } else {
        return res.status(400).json({ status: "error", error: "Product Duplicated" })
    }
}

export const updateProduct = async (req, res) => {
    const idProd = req.params.pid
    const product = req.body
    const productToUpdate = await productModel.updateOne({ _id: idProd }, product)

    res.json({ status: 'success', message: 'Product updated!', productToUpdate })
}

export const deleteProduct = async (req, res) => {
    const idProd = req.params.pid
    const productToDelete = await productModel.deleteOne({ _id: idProd })

    res.json({ status: 'success', message: 'Product deleted!', productToDelete })
}
