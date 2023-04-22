import TicketModel from "./models/ticket.model.js"

export default class Ticket {
    constructor() {}

    get = async() => {
        return await TicketModel.find().lean().exec()
    }

    getById = async(id) => {
        return await TicketModel.findById(id).lean().exec()
    }

    create = async(data) => {
        return await TicketModel.create(data)
    }
}