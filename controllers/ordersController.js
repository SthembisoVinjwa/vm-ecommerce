const Order = require('../models/order')
const User = require('../models/users')
const OrderItem = require('../models/users')
const mongoose = require('mongoose')

exports.order_get_all_orders = (req, res, next) => {
  Order.findMany({ user: req.userData.userId })
    .select('_id user complete orderItems')
    .populate(['user', 'orderItems'])
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Orders retrieved successfully',
        numberOfOrders: result.length,
        order: result
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.body.orderId)
    .select('_id user complete orderItems')
    .populate(['user', 'orderItems'])
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Order retrieved successfully',
        order: result
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.orders_create_order = async (req, res, next) => {
  const orderItems = []

  for (let i = 0; i < req.body.orderItems.length; i++) {
    let orderItem = req.body.orderItems[i]
    orderItems.push((await OrderItem.findById(orderItem))._id)
  }

  User.findById(req.userData.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: 'user not found'
        })
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        user: req.userData.userId,
        complete: req.body.complete,
        orderItems: orderItems
      })
      return order.save()
    })
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Order created successfully',
        order: {
          _id: result._id,
          userId: result.userId,
          complete: result.complete,
          orderItems: result.orderItems
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.orders_update_order = async (req, res, next) => {
  const id = req.params.orderId
  const updateOps = {}
  const orderItems = []

  for (let i = 0; i < req.body.orderItems.length; i++) {
    let orderItem = req.body.orderItems[i]
    orderItems.push((await OrderItem.findById(orderItem))._id)
  }

  for (let i = 0; i < req.body.length; i++) {
    const propName = Object.keys(req.body[i])[0]

    if (propName === 'orderItems') {
      updateOps['orderItems'] = orderItems
    } else {
      const value = req.body[i][propName]
      updateOps[propName] = value
    }
  }

  Order.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: `Order with id: ${id} is updated successfully.`
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}
