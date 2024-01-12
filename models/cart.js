const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = Schema(
  {
    _id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }]
  },
  { timestamps: true }
)

const cart = mongoose.model('Cart', cartSchema)

module.exports = cart
