import CartDTO from '../dao/DTO/cart.dto.js'

export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    get = async() => {
        return await this.dao.get()
    }

    getById = async(id) => {
        return await this.dao.getById(id)
    }

    create = async(data) => {
        const dataDTO = new CartDTO(data)
        return await this.dao.create(dataDTO)
    }

    update = async(id, data) => {
        const update = new CartDTO(data)
        return await this.dao.update(id, update)
    }
}

// Esto se manda a index.js