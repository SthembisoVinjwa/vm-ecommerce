const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    color: { type: String, required: true },
    itemImage: { type: String, required: true },
    price: { type: Number, required: true }, 
    description: { type: String}
});

module.exports = mongoose.model('Item', itemSchema);