const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(
  'mongodb+srv://vinjwacr7:' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0.rqavnth.mongodb.net/?retryWrites=true&w=majority'
)

const path = require('path')

// Set view engine and static folder
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/public')))

const usersRouter = require('./routes/users')
const renderRouter = require('./routes/render')
const itemsRouter = require('./routes/items');
const orderItemsRouter = require('./routes/orderItems');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.use('/uploadItems', express.static('uploadItems'))

app.use(morgan('tiny'))

app.use('/app', renderRouter)

app.use('/users', usersRouter)
app.use('/items', itemsRouter);
app.use('/orderItems', orderItemsRouter);

app.use('', (req, res, next) => {
  const error = new Error('Not found')
  res.status(404)
  next(error)
})

app.use((err, req, res, next) => {
  res.json({
    error: err
  })
})

module.exports = app
