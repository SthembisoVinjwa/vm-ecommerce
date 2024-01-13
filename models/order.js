const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = Schema(
  {
    _id: Schema.Types.ObjectId,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    complete: {
        type: Boolean,
        default: false,
        required: true
    },
    orderItems: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }]
  },
  { timestamps: true }
)
