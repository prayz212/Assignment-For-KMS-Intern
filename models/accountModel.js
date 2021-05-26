const mongoose = require('mongoose')
const Schema = mongoose.Schema

const account = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    employee_id: {
        type: Number,
        required: true
    },
    age: Number,
    title: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        default: null
    },
    active: {
        type: Boolean,
        default: false
    },
    role: Number
})

module.exports = mongoose.model("Account", account)