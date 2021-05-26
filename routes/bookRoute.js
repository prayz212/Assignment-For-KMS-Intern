const express = require('express')
const router = express.Router()
const bookController = require('../controllers/homeController')

router.get('/', bookController.getAllBook)
router.post('/add', bookController.addNewBook)
router.put('/update/:name', bookController.updateBookByID)
router.delete('/delete/:name', bookController.deleteBookByID)

module.exports = router