const jwt = require('jsonwebtoken')
const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = (req, res, next) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization

        jwt.verify(token, PRIVATE_KEY, function(err, payload) {
            if (err) return res.json({code: 404, status: "failed", error: err.message})
            
            let {id, role} = payload
            req.acc_id = id
            req.role = role
            next()
        })
    } 
    else return res.json({code: 404, status: "failed", error: "you must attach token with the request."})
}