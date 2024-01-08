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

const usersRouter = require('./routes/users')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.use(morgan('tiny'))

app.use('/users', usersRouter)

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
