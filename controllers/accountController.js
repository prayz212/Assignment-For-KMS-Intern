const Account = require('../models/accountModel')
const bcrypt = require('bcryptjs')
const saltRounds = 12

exports.handleRegistration = (req, res) => {
    let {username, password, fullname, id, age, title, email} = req.body

    bcrypt.genSalt(saltRounds)
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
        
    })
}

exports.handleLogin = (req, res) => {
    let {username, password} = req.body
}
