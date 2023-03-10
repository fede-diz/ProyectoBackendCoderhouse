import fs from 'fs'

class ProductsManager {

    constructor(path) {
        this.path = path
        this.format = 'utf-8'
    }

    writeFile = productsArray => {
        return fs.promises.writeFile(this.path, JSON.stringify(productsArray))
    }

    getNextID = async () => {
        return this.getProducts()
            .then(products => {
                const count = products.length
                return (count > 0) ? products[count-1].id + 1 : 1
            })
    }
    
    getProducts = async () => {
        return fs.promises.readFile(this.path, this.format)
            .then(content => JSON.parse(content))
            .catch(() => {return [] })
    }
    
    getProductsById = async (id) => {
        const products = await this.getProducts()
        const productById = products.find(prod => prod.id == id);

        return productById ?? "Not Found"
    }

    addProduct = async (obj) => {
        const products = await this.getProducts()
        const id = await this.getNextID()
    
        obj.id = id

        const codes = products.map(prod => prod.code);

        if (codes.includes(obj.code)) {
            console.log(`ERROR: CÓDIGO DUPLICADO\nNo se agrega el producto "${obj.title}"`)
        } else {
            products.push(obj)
            await this.writeFile(products)  
            return obj
        }
    }

    updateProduct = async (id, object) => {
        const products = await this.getProducts()

        for (let i = 0; i < products.length; i++) {
            if (products[i].id == id){
                products[i] = object
        
                await this.writeFile(products) 
                break
            }
        }
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts()
        const productToDelete = products.findIndex(prod => prod.id == id)

        if (!productToDelete) {
            return console.log("Not Found")
        } else {
            products.splice(productToDelete,1)
            await this.writeFile(products)
            return productToDelete
        }
    }
}

export default ProductsManager