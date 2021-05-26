const Book = require('../models/bookModel')

exports.getAllBook = (req, res) => {
    Book.find({})
    .then(books => {
        res.json({code: 200, status: "successed", data: books})
    })
    .catch(err => {
        res.json({code: 400, status: "failed", error: err.message})
    })
}

exports.addNewBook = (req, res) => {
    let {name, author, description, page} = req.body

    let newBook = new Book({
        name,
        author,
        description,
        total_page: page,
    })

    newBook.save((err, result) => {
        if (err) return res.json({code: 400, status: "failed", error: err.message})
        return res.json({code: 201, status: "successed", data: result})
    })
}

exports.updateBookByID = (req, res) => {
    let {name} = req.params
    let {author, description, page} = req.body

    Book.updateOne({name}, {author, description, page})
    .then(result => {
        if (result.nModified == 1) {
            return res.json({code: 200, status: "successed", updated: name})
        } else if (result.nModified == 0 && result.n == 0) {
            return res.json({code: 409, status: "failed", error: "don't have any document match this book name."})
        }
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})
    })
}

exports.deleteBookByID = (req, res) => {
    let {name} = req.params

    Book.deleteOne({name})
    .then(result => {
        if (result.deletedCount == 1) {
            return res.json({code: 200, status: "successed", deleted: name})
        } else if (result.deletedCount == 0 && result.n == 0) {
            return res.json({code: 406, status: "failed", error: "don't have any document match this book name."})
        }
    })
    .catch((err) => {
        return res.json({code: 400, status: "failed", error: err.message})
    })
}