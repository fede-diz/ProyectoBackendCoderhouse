import FileManager from "./fileManager.js"

export default class User {

    constructor() {
        this.fileManager = new FileManager("db_files/users.json")
    }
    
    get = async () => {
        return await this. fileManager.get()
    }

    getById = async (id) => {
        return await this.fileManager.getByParams("id", id)
    }

    getByEmail = async (email) => {
        return await this.fileManager.getByParams("email", email)
    }

    create = async (data) => {
        return await this.fileManager.create(data)
    }

    update = async (id, obj) => {
        return await this.fileManager.update(id, obj)
    }

    delete = async (id) => {
        return await this.fileManager.delete("id", id)
    }
}
