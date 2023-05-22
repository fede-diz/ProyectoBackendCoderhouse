import UserDTO from '../dao/DTO/user.dto.js'
import Mail from '../utils/email.js'

export default class UserRepository {
    constructor(dao) {
        this.dao = dao
        this.mail = new Mail()
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

    getInactiveUsers = async(inactiveTime) => {
        return await this.dao.getInactive(inactiveTime)
    }

    create = async(data) => {
        const dataDTO = new UserDTO(data)
        return await this.dao.create(dataDTO)
    }

    update = async(id, data) => {
        return await this.dao.update(id, data)
    }

    delete = async(id) => {
        return await this.dao.delete(id)
    }

    mailDelete = async(id) => {
        const user = await this.dao.getById(id)

        let html = `
            <div>
                <h1>Usuerio eliminado</h1>
                <br>
                <p>Debido a no loguearse a la cuenta en los últimos 2 días, el usuario se ha eliminado.</p>
                <p>Para seguir usando la plataforma, volvé a registrarte haciendo click en este <a href="https://entrega-final-coder-backend-production.up.railway.app/api/session/register">link</a></p>
            </div>
        `

        await this.mail.send(user, "Usuario Eliminado por Inactividad", html)

        return await this.dao.delete(id)
    }
}
