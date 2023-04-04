import { Product, Cart, User, Message, Ticket } from '../dao/factory.js'
import CartRepository from './cart.repository.js'
import MessageRepository from './message.repository.js'
import ProductRepository from './product.repository.js'
import TicketRepository from './ticket.repository.js'
import UserRepository from './user.repository.js'

export const CartService = new CartRepository(new Cart)
export const MessageService = new MessageRepository(new Message)
export const ProductService = new ProductRepository(new Product)
export const TicketService = new TicketRepository(new Ticket)
export const UserService = new UserRepository(new User)

// Esto se manda a Controller