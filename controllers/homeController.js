/*
    role = 1 => ADMIN => GET ALL BOOK, GET BOOK BY NAME, ADD NEW BOOK, UPDATE BOOK, DELETE BOOK
    role = 2 => USER LEVEL 1 => GET ALL BOOK, GET BOOK BY NAME, ADD NEW BOOK
    role = 3 => USER LEVEL 2 => GET ALL BOOK, GET BOOK BY NAME, UPDATE BOOK
    role = 4 => USER LEVEL 3 => GET ALL BOOK, GET BOOK BY NAME, DELETE BOOK
    role = 5 => USER LEVEL 4 => GET BOOK BY NAME
*/

const Book = require('../models/bookModel')

exports.getAllBook = (req, res) => {
    let role = req.role

    if (role == 1 || role == 2 || role == 3 || role == 4) {
        Book.find({})
        .then(books => {
            res.json({code: 200, status: "successed", data: books})
        })
        .catch(err => {
            res.json({code: 400, status: "failed", error: err.message})
        })
    }
    else res.json({code: 400, status: "failed", error: "this account do not have permission."})
}

exports.getBookByName = (req, res) => {
    let {name} = req.params

    Book.findOne({name})
    .then(book => {
        res.json({code: 200, status: "successed", data: book})
    })
    .catch(err => {
        res.json({code: 400, status: "failed", error: err.message})
    })
}

exports.addNewBook = (req, res) => {
    let role = req.role
    let {name, author, description, page} = req.body

    if (role == 1 || role == 2) {
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
    else res.json({code: 400, status: "failed", error: "this account do not have permission."})
}

exports.updateBookByID = (req, res) => {
    let {name} = req.params
    let {author, description, page} = req.body
    let role = req.role

    if (role == 1 || role == 3) {
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
    else res.json({code: 400, status: "failed", error: "this account do not have permission."})
}

exports.deleteBookByID = (req, res) => {
    let {name} = req.params
    let role = req.role

    if (role == 1 || role == 4) {
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
    else res.json({code: 400, status: "failed", error: "this account do not have permission."})
}