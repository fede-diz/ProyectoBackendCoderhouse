import UserModel from "./models/user.model.js"

export default class User {
    constructor() {}

    get = async() => {
        return await UserModel.find().lean().exec()
    }

    getById = async(id) => {
        return await UserModel.findById(id).lean().exec()
    }

    getByEmail = async(email) => {
        return await UserModel.findOne({ email }).lean().exec()
    }

    create = async(data) => {
        return await UserModel.create(data)
    }

    update = async (id, update) => {
        return await UserModel.updateOne({ _id: id }, update)
    }
}