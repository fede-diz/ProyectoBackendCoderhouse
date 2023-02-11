import fs from 'fs'

class CartsManager {

    constructor(path) {
        this.path = path
        this.format = 'utf-8'
    }
    
    writeFile = cartsArray => {
        return fs.promises.writeFile(this.path, JSON.stringify(cartsArray))
    }

    getCarts = async () => {
        return fs.promises.readFile(this.path, this.format)
            .then(content => JSON.parse(content))
            .catch(() => {return [] })
    }

    getNextID = async () => {
        return this.getCarts()
            .then(carts => {
                const count = carts.length
                return (count > 0) ? carts[count-1].id + 1 : 1
            })
    }

    getCartsById = async (id) => {
        const carts = await this.getCarts()
        const cartById = carts.find(cart => cart.id == id);

        return cartById ?? "Not Found"
    }

    addCart = async () => {
        const carts = await this.getCarts()
        const id = await this.getNextID()
        const newCart = {
            id,
            products: []
        }
       
        carts.push(newCart)
        await this.writeFile(carts)  
        return newCart
    }

    addProduct = async (idCart, idProd) => {
        const cart = await this.getCartsById(idCart)
        
        let productToUpdate = null
        for (let i = 0; i < carts.products.length; i++) {
            if (cart.products[i].id == idProd) {
                cart.products[i].quantity++
                productToUpdate = 1
                break
            }
        }
        if (productToUpdate == null) {
            cart.products.push({ id: idProd, quantity: 1 })
        }
        await this.update(idCart, cart)
        return cart
    }

    updateCart = async (id, obj) => {
        obj.id = id
        const cart = await this.getCarts()
        
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id == id) {
                cart[i] = obj

                await this.writeFile(cart) 
                break
            }
        }
    }

}

export default CartsManager