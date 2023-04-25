export default class ProductDTO {
    constructor(product) {
        this.title = product.title || ""
        this.description = product.description || ""
        this.code = product.code || ""
        this.price = product.price || 0
        this.stock = product.stock || 0
        this.category = product.category || ""
        this.thumbnail = product.thumbnail || ""
        this.owner = product.owner || ""
    }
}

// Los DTO se hace todos así genéricos y vacíos, para que si recibe el campo sin nada, por lo menos lo categorice bien