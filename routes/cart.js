const express = require('express')
const router = express.Router()
const Cart = require('../models/cart')
const User = require('../models/users')
const OrderItem = require('../models/orderItem')

router.post('/:userId', (req, res, next) => {
    const userId = req.params.userId

    User.findById(userId)
})

module.exports = router