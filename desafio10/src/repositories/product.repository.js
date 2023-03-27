import ProductDTO from '../dao/DTO/product.dto.js'

export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    get = async() => {
        return await this.dao.get()
    }

    getById = async(id) => {
        return await this.dao.getById(id)
    }

    getByCode = async(code) => {
        return await this.dao.getByCode(code)
    }

    getPaginate = async(search, options) => {
        return await this.dao.getPaginate(search, options)
    }

    create = async(data) => {
        const dataDTO = new ProductDTO(data)
        return await this.dao.create(dataDTO)
    }

    update = async(id, data) => {
        const update = new ProductDTO(data)
        return await this.dao.update(id, update)
    }
}

// Esto se manda a index.js