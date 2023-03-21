import FileManager from "./fileManager.js"

export default class Cart {

    constructor() {
        this.fileManager = new FileManager("db_files/carts.json")
    }
    
    get = async () => {
        return await this. fileManager.get()
    }
    
    getById = async (id) => {
        return await this.fileManager.getByParams("id", id)
    }

    create = async (data) => {
        return await this.fileManager.create(data)
    }

    update = async (id, obj) => {
        return await this.fileManager.update(id, obj)
    }
}
