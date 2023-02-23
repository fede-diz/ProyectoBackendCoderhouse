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
    role: String,
    cart: {
        type: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "carts"
            }
        }],
        unique: true
    }
})

userSchema.pre('find', function() {
    this.populate('cart.id')
})
userSchema.pre('findOne', function() {
    this.populate('cart.id')
})
userSchema.pre('findByID', function() {
    this.populate('cart.id')
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel