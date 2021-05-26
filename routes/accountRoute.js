const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')

router.post('/register', accountController.handleRegistration)
router.post('/login', accountController.handleLogin)
router.post('/getInfo', accountController.handleGetUserInfo)

module.exports = router