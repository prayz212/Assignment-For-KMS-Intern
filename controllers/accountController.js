const Account = require('../models/accountModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const PRIVATE_KEY = process.env.PRIVATE_KEY
const SALT_ROUNDS = 12

exports.handleRegistration = (req, res) => {
    let {username, password, fullname, id, age, title, email} = req.body

    bcrypt.genSalt(SALT_ROUNDS)
    .then(salt => {
        bcrypt.hash(password, salt)
        .then(hashed => {
            let newUser = new Account({
                username,
                password: hashed,
                fullname,
                employee_id: id,
                age,
                title,
                email
            })
    
            newUser.save((err, result) => {
                if (err) return res.json({code: 400, status: "failed", error: err.message})
                return res.json({code: 201, status: "successed", data: result})
            })
        })
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})
    })
}

exports.handleLogin = (req, res) => {
    let {username, password} = req.body

    Account.find({username})
    .then(account => {  
        if (account.length <= 0) {
            throw new Error("username or password is not correct.")
        }
        return account[0]
    })
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password)
            .then(match => { //return TRUE if match otherwise is FALSE
                if (match) {
                    const token = jwt.sign({data: user._id}, PRIVATE_KEY, {expiresIn: 10*60})
                    return res.json({code: 200, status: "successed", token})
                }
                else if (!match) {
                    throw new Error("username or password is not correct.")
                }
            })
            .catch(err => {
                return res.json({code: 404, status: "failed", error: err.message})
            })
        }
    })
    .catch(err => {
        return res.json({code: 404, status: "failed", error: err.message})
    })
}

exports.handleGetUserInfo = (req, res) => {
    let {token} = req.body

    jwt.verify(token, PRIVATE_KEY, function(err, payload) {
        if (err) return res.json({code: 404, status: "failed", error: err.message})
        else {
            let id = payload.data

            Account.findById(id, '-_id -__v -password')
            .then(result => {
                return res.json({code: 200, status: "successed", data: result})        
            })
            .catch(err => {
                return res.json({code: 404, status: "failed", error: err.message})        
            })
        }
        
    })
}