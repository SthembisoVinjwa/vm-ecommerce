const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = Schema(
  {
    _id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
  },
  { timestamps: true }
)

const cart = mongoose.model('Cart', cartSchema)

module.exports = cart
