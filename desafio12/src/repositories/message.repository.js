import MessageDTO from '../dao/DTO/message.dto.js'

export default class MessageRepository {
    constructor(dao) {
        this.dao = dao
    }

    get = async() => {
        return await this.dao.get()
    }

    create = async(data) => {
        const dataDTO = new MessageDTO(data)
        return await this.dao.create(dataDTO)
    }
}

// Esto se manda a index.js