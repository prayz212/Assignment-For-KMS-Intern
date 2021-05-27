const express = require('express')
const router = express.Router()
const bookController = require('../controllers/homeController')
const checkPermission = require('../middlewares/checkPermission')

router.get('/', checkPermission, bookController.getAllBook)
router.get('/:name', bookController.getBookByName)
router.post('/add', checkPermission, bookController.addNewBook)
router.put('/update/:name', checkPermission, bookController.updateBookByID)
router.delete('/delete/:name', checkPermission, bookController.deleteBookByID)

module.exports = router