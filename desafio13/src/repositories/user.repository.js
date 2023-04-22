import UserDTO from '../dao/DTO/user.dto.js'

export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    get = async() => {
        return await this.dao.get()
    }

    getById = async(id) => {
        return await this.dao.getById(id)
    }

    getByEmail = async(email) => {
        return await this.dao.getByEmail(email)
    }

    create = async(data) => {
        const dataDTO = new UserDTO(data)
        return await this.dao.create(dataDTO)
    }

    update = async(id, data) => {
        const update = new UserDTO(data)
        return await this.dao.update(id, update)
    }
}

// Esto se manda a index.js