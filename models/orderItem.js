const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        require: true
     },
    quantity: {type: Number, default: 1, required:true}
});


module.exports = mongoose.model('OrderItem', orderItemSchema);