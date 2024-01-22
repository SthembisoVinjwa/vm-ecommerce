const mongoose = require('mongoose')
const Cart = require('../models/cart')
const OrderItem = require('../models/orderItem')
const Item = require('../models/item')

exports.cart_add = async (req, res, next) => {
  const userId = req.userData.userId
  const orderItems = []
  const updateOps = {}

  const checkCart = await Cart.findOne({ user: userId })

  if (checkCart) {
    Item.findById(req.body.itemId)
      .then(async item => {
        const existingOrderItem = await OrderItem.findOne({ item: item._id })

        if (existingOrderItem) {
          const newQuantity = existingOrderItem.quantity + 1

          OrderItem.findOneAndUpdate(
            { _id: existingOrderItem._id },
            { $set: { quantity: newQuantity } }
          )
            .then(
              res.status(200).json({
                message: "One item added to cart"
              })
            )
            .catch(err => {
              res.status(500).json({
                error: err
              })
            })
        } else {
          const orderItem = new OrderItem({
            _id: new mongoose.Types.ObjectId(),
            item: item._id,
            quantity: 1
          })

          orderItem
            .save()
            .then(async savedOrderItem => {
              const oldCart = await Cart.findOne({ user: req.userData.userId })

              for (let i = 0; i < oldCart.orderItems.length; i++) {
                orderItems.push(oldCart.orderItems[i]._id)
              }

              orderItems.push(savedOrderItem._id)

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
            .catch(err => {
              res.status(500).json({
                error: err
              })
            })
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
  } else {
    return Item.findById(req.body.itemId)
      .then(item => {
        const orderItem = new OrderItem({
          _id: new mongoose.Types.ObjectId(),
          item: item._id,
          quantity: 1
        })

        orderItem
          .save()
          .then(savedOrderItem => {
            orderItems.push(savedOrderItem._id)

            const cart = Cart({
              _id: new mongoose.Types.ObjectId(),
              user: userId,
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
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
  }
}

exports.cart_get = (req, res, next) => {
  Cart.findOne({ user: req.userData.userId })
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
}

exports.cart_get_total = (req, res, next) => {
  Cart.findOne({ user: req.userData.userId })
    .select('-__v')
    .populate('user')
    .populate('orderItems')
    .then(cart => {
      if (cart) {
        let count = 0

        for (let i = 0; i < cart.orderItems.length; i++) {
          count += cart.orderItems[i].quantity
        }

        return res.status(200).json({
          cartTotal: count
        })
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
}

exports.cart_delete = (req, res, next) => {
  Cart.deleteMany({ user: req.userData.userId })
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
}
