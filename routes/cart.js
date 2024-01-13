const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')

const cartController = require('../controllers/cartController')

router.post('/', checkAuth, cartController.cart_create)

router.get('/', checkAuth, cartController.cart_get)

router.patch('/', checkAuth, cartController.cart_patch)

router.delete('/', checkAuth, cartController.cart_delete)

module.exports = router
