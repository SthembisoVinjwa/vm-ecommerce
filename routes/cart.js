const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')

const cartController = require('../controllers/cartController')

router.post('/', checkAuth, cartController.cart_add)

router.get('/', checkAuth, cartController.cart_get)

router.get('/total', checkAuth, cartController.cart_get_total)

router.delete('/', checkAuth, cartController.cart_delete)

module.exports = router
