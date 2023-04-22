import TicketDTO from '../dao/DTO/ticket.dto.js'

export default class TicketRepository {
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
        const dataDTO = new TicketDTO(data)
        return await this.dao.create(dataDTO)
    }
}

// Esto se manda a index.js