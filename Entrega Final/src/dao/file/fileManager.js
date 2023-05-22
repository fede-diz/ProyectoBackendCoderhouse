import fs from 'fs'

export default class FileManager {

    constructor(path) {
        this.path = path
        this.format = 'utf-8'
    }

    write = async (array) => {
        return fs.promises.writeFile(this.path, JSON.stringify(array))
    }

    read = async () => {
        return fs.promises.readFile(this.path, this.format)
            .then(r => JSON.parse(r))
            .catch(() => {return [] })
    }
    
    get = async () => {
        const data = await this.read()
        return data
    }

    getNextID = async () => {
        return this.read()
            .then(data => {
                const count = data.length
                return (count > 0) ? data[count-1].id + 1 : 1
            })
    }
    
    getByParams = async (param, value) => {
        const data = await this.read()
        const obj = data.find(o => o[param] == value)

        return obj
    }

    create = async (obj) => {
        const data = await this.read()
        const id = await this.getNextID()
    
        obj.id = id

        data.push(obj)
        await this.write(data)  
        return obj
    }

    update = async (id, obj) => {
        obj.id = id
        const data = await this.read()

        for (let i = 0; i < data.length; i++) {
            if (data[i].id == id){
                data[i] = obj
        
                await this.write(data) 
                break
            }
        }
        return obj
    }

    delete = async (param, id) => {
        const data = await this.read()
        const index = data.findIndex(o => o[param] == id)
        data.splice(index, 1)

        await this.write(data)

        return data
    }
}