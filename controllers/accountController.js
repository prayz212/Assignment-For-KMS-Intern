const Account = require('../models/accountModel')
const Code = require('../models/activeCodeModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')
const PRIVATE_KEY = process.env.PRIVATE_KEY
const SALT_ROUNDS = 12

exports.handleRegistration = (req, res) => {
    let {username, password, fullname, id, age, title, email, role} = req.body

    bcrypt.genSalt(SALT_ROUNDS)
    .then(salt => {
        return bcrypt.hash(password, salt)
    })
    .then(hashed => {
        let newUser = new Account({
            username,
            password: hashed,
            fullname,
            employee_id: id,
            age,
            title,
            email, 
            role
        })

        return newUser.save()
    })
    .then(result => {
        if (result) {
            let newActiveCode = new Code({
                email: result.email,
                code: Math.random().toString().substring(2,8)
            })

            return newActiveCode.save()
        }
    })
    .then(result => {
        sendMail(result.email, result.code)
        return res.json({code: 201, status: "successed", message: "Please check your mail to active your account."})
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})
    })
}

exports.handleLogin = (req, res) => {
    let {username, password} = req.body
    let data = undefined

    Account.find({username})
    .then(account => {  
        if (account.length <= 0) {
            throw new Error("username or password is not correct.")
        }
        return account[0]
    })
    .then(user => {
        if (user) {
            data = user
            
            return bcrypt.compare(password, user.password)
        }
    })
    .then(match => { //return TRUE if match otherwise is FALSE
        if (match) {
            const token = jwt.sign({id: data._id, role: data.role}, PRIVATE_KEY, {expiresIn: 10*60})
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

exports.handleGetUserInfo = (req, res) => {
    let {token} = req.body

    jwt.verify(token, PRIVATE_KEY, function(err, payload) {
        if (err) return res.json({code: 404, status: "failed", error: err.message})
        else {
            console.log(payload);
            let {id, role} = payload

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

exports.handleActiveAccount = (req, res) => {
    let {code, email} = req.body

    Code.findOne({email, code})
    .then(result => {
        return result.exp;
    })
    .then(exp => {
        return isExpired(exp)
    })
    .then(result => {
        if (result) { //expire
            throw new Error("this activate code is expired.")
        } else { //not expire
            return Account.findOneAndUpdate({email}, {active: true}, {new: true})
        }
    })
    .then(account => {
        return res.json({code: 200, status: "successed", data: account})
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})        
    })
}

let sendMail = (toEmail, activeCode) => {
    const sender = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nhoxpro1215@gmail.com',
            pass: 'Chivi234'
        }
    })

    const mail = {
        from: "nhoxpro1215@gmail.com",
        to: `${toEmail}`,
        subject: "Activate your KMS account",
        text: `This is your active code: ${activeCode}. It will expire after 10 minutes.`
    }

    sender.sendMail(mail, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info.accepted);
        }
    })
}

let isExpired = (date) => {
    const now = Date.now()
    const createAt = Date.parse(date)

    timeRemaining = now - createAt
    return timeRemaining > 600000
}