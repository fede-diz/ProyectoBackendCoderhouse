import FileManager from "./fileManager.js"

export default class Product {

    constructor() {
        this.fileManager = new FileManager("db_files/products.json")
    }

    get = async () => {
        return await this.fileManager.get()
    }

    getById = async (id) => {
        return await this.fileManager.getByParams("_id", id)
    }

    getByCode = async (code) => {
        return await this.fileManager.getByParams("code", code)
    }

    getPaginate = async () => {
        const data = await this.fileManager.get()

        return {
            totalDocs: data.length,
            docs: data,
            limit: data.length,
            page: 1,
            nextPage: null,
            prevPage: null,
            totalPages: 1,
            pagingCounter: 1,
            meta: 'paginator',
          }
    }

    create = async (data) => {
        return await this.fileManager.create(data)
    }

    update = async (id, obj) => {
        return await this.fileManager.update(id, obj)
    }
}
