const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true},
    email: { type: String, unique: true, required: true},
    password: { type: String, required: true}
})

const user = mongoose.model('User', userSchema)

module.exports = user