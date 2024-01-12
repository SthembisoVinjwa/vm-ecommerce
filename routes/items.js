const express = require('express')
const mongoose = require('mongoose')
const Item = require('../models/item')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const { exec } = require('child_process')

if (!fs.existsSync('./uploadItems')) {
  fs.mkdirSync('./uploadItems')
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploadItems')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

router.post('/', upload.single('itemImage'), (req, res, next) => {
  const item = new Item({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    type: req.body.type,
    color: req.body.color,
    itemImage: process.env.SERVER_URL + 'uploadItems/' + req.file.filename,
    price: req.body.price
  })

  item
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Item created successfully',
        item: result
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.get('/', (req, res, next) => {
  Item.find()
    .select('name price color itemImage _id type')
    .exec()
    .then(response => {
      res.status(200).json({
        numberOfItems: response.length,
        Items: response
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.get('/:itemId', (req, res, next) => {
  const id = req.params.itemId

  Item.findById(id)
    .select('name price color itemImage _id type')
    .exec()
    .then(response => {
      res.status(200).json({
        message: 'The item has been retrieved successfully!',
        Items: response
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.patch('/:itemId', (req, res, next) => {
  console.log(req.body)
  const id = req.params.itemId
  const updateOps = {}

  for (let i = 0; i < req.body.length; i++) {
    const propName = Object.keys(req.body[i])[0]
    const value = req.body[i][propName]
    updateOps[propName] = value
  }

  Item.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(response => {
      res.status(200).json({
        message: `Item with id: ${req.params.itemId} is updated Successfully`
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

router.delete('/:itemId', async (req, res, next) => {
  const id = req.params.itemId
  let path = ''

  try {
    const response = await Item.findById(id).exec()
    path = `./uploadItems/${response.itemImage}`.replace(`${process.env.SERVER_URL}uploadItems/`, '')
  } catch (err) {
    res.status(404).json({
      message: 'item not found'
    })
  }

  try {
    fs.unlinkSync(path)
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.status(404).json({
        message: 'image does not exist'
      })
    } else {
      res.status(500).json({
        error: err
      })
    }
  }

  Item.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'The item has been deleted'
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

module.exports = router
