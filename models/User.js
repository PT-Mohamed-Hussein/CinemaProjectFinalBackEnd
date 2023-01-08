const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        user: {
            type: Number,
            default: 2001
        },
        admin: {
            type: Number
        }
    },
    phoneno: {
        type: String,
        required: true
    },
    refreshToken: {
        type: [String],
        required: false
    },
    profilePicture: {
        type: String,
        required: false,
        default: 'http://localhost:3500/images/profile.jpg'
    },
    firstName:{
        type: String,
        required: false,
        default: ''
    },
    lastName:{
        type: String,
        required: false,
        default: ''
    }
})

module.exports = mongoose.model('User', UserSchema)