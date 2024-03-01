const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    otp: {
        value: String,
        expiresIn: Date,
    },
    role: {
        type: String,
        required: true,
        default: 'manager',
        enum: ['manager', 'admin']
    },
    facebookID: {
        type: String,
        unique: true,
        sparse: true,
    },


},
{
    timestamps: true,
},
)
const UserModel = mongoose.model('User', UserSchema)

module.exports = {
    UserModel
}