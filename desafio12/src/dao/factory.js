import config from "../config/config.js";
import mongoose from "mongoose";

export let Cart
export let Message
export let Product
export let User
export let Ticket

console.log(`PERSISTENCE: [${config.persistence}]`)
switch (config.persistence) {
    case 'FILE':
        const { default: ProductFile } = await import('./file/product.file.js')
        const { default: MessageFile } = await import('./file/message.file.js')
        const { default: UserFile } = await import('./file/user.file.js')
        const { default: CartFile } = await import('./file/cart.file.js')

        Product = ProductFile
        Message = MessageFile
        Cart = CartFile
        User = UserFile
        Ticket = {}

        break;

    case 'MONGO':
        mongoose.set('strictQuery', false)
        mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: config.mongoDBName
        }, () => console.log('Mongo connected'))
                
        const { default: ProductMongo } = await import('./mongo/product.mongo.js')
        const { default: MessageMongo } = await import('./mongo/message.mongo.js')
        const { default: UserMongo } = await import('./mongo/user.mongo.js')
        const { default: CartMongo } = await import('./mongo/cart.mongo.js')
        const { default: TicketMongo } = await import('./mongo/ticket.mongo.js')

        Product = ProductMongo
        Message = MessageMongo
        Cart = CartMongo
        User = UserMongo
        Ticket = TicketMongo

        break;

    default:
        break;
}