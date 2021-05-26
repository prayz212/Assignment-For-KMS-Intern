const mongoose = require('mongoose')
const Schema = mongoose.Schema

const book = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    author: [{type:String, require: true}],
    description: String,
    total_page: Number,
    date: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Book", book)