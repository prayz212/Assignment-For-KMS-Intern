const mongoose = require('mongoose')
const Schema = mongoose.Schema

const code = new Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true  
    },
    exp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Code", code)