const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')

router.post('/register', accountController.handleRegistration)
router.post('/login', accountController.handleLogin)

module.exports = router