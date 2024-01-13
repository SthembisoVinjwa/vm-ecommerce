const express = require('express')
const router = express.Router()
const Cart = require('../models/cart')
const User = require('../models/users')
const OrderItem = require('../models/orderItem')
const checkAuth = require('../middleware/checkAuth')
const mongoose = require('mongoose')

router.post('/', checkAuth, (req, res, next) => {
    const userId = req.userData.userId
    const orderItemsId = req.body.orderItems

    User.findById(userId)
    .then(user => {
        OrderItem.findById(orderItemsId)
        .then(orderItems => {
            const cart = Cart({
                _id: new mongoose.Types.ObjectId(),
                user: user._id,
                orderItems: orderItems._id
            })

            cart.save()
            .then(result => {
                res.status(201).json({
                    message: 'Cart created successfully',
                    cart: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.get('/', checkAuth, (req, res, next) => {
    Cart.find({ user: req.userData.userId })
    .select('-__v')
    .populate('user')
    .populate('orderItems')
    .then(cart => {
        if (cart) {
            return res.status(200).json(cart)
        } else {
            return res.status(404).json({
                message: 'Cart not found'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router