const express = require('express')
const router = express.Router()
const Cart = require('../models/cart')
const User = require('../models/users')
const OrderItem = require('../models/orderItem')
const checkAuth = require('../middleware/checkAuth')
const mongoose = require('mongoose')

router.post('/', checkAuth, async (req, res, next) => {
  const userId = req.userData.userId
  const orderItems = []

  for (let i = 0; i < req.body.orderItems.length; i++) {
    let orderItem = req.body.orderItems[i]
    orderItems.push((await OrderItem.findById(orderItem))._id)
  }

  User.findById(userId)
    .then(user => {
      const cart = Cart({
        _id: new mongoose.Types.ObjectId(),
        user: user._id,
        orderItems: orderItems
      })

      cart
        .save()
        .then(result => {
          res.status(201).json(result)
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

router.patch('/', checkAuth, async (req, res, next) => {
  const updateOps = {}
  const orderItems = []

  for (let i = 0; i < req.body.orderItems.length; i++) {
    let orderItem = req.body.orderItems[i]
    orderItems.push((await OrderItem.findById(orderItem))._id)
  }

  updateOps['orderItems'] = orderItems

  Cart.findOneAndUpdate(
    { user: req.userData.userId },
    { $set: updateOps },
    { new: true }
  )
    .then(cart => {
      res.status(200).json(cart)
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.delete('/', checkAuth, (req, res, next) => {
  Cart.findOneAndDelete({ user: req.userData.userId })
    .then(
      res.status(200).json({
        message: 'Cart deleted successfully'
      })
    )
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

module.exports = router
