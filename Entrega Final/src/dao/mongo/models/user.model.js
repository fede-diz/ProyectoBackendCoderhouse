import mongoose from 'mongoose'

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    last_session: String,
    cart: {
        type: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "carts"
            }
        }],
        unique: true
    },
    ticket: {
        type: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "tickets"
            }
        }],
        default: []
    }
})

userSchema.pre('find', function() {this.populate('cart.id')})
userSchema.pre('findOne', function() {this.populate('cart.id')})
userSchema.pre('findById', function() {this.populate('cart.id')})

userSchema.pre('find', function() {this.populate('ticket.id')})
userSchema.pre('findOne', function() {this.populate('ticket.id')})
userSchema.pre('findById', function() {this.populate('ticket.id')})

const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel