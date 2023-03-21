import FileManager from "./fileManager.js"

export default class Message {

    constructor() {
        this.fileManager = new FileManager("db_files/messages.json")
    }
    
    get = async () => {
        return await this. fileManager.get()
    }

    create = async (data) => {
        return await this.fileManager.create(data)
    }
}
