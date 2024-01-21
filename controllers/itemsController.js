const mongoose = require('mongoose')
const Item = require('../models/item')
const fs = require('fs')

exports.items_create_item = (req, res, next) => {
  const item = new Item({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    type: req.body.type,
    color: req.body.color,
    itemImage: process.env.SERVER_URL + 'uploadItems/' + req.file.filename,
    price: req.body.price,
    description: req.body.description
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
}

exports.items_get_all_items = (req, res, next) => {
  Item.find()
    .select('name price color itemImage _id type description')
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
}

exports.items_get_single_item = (req, res, next) => {
  const id = req.params.itemId

  Item.findById(id)
    .select('name price color itemImage _id type description')
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
}

exports.items_update_item = (req, res, next) => {
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
}

exports.items_delete_single_item = async (req, res, next) => {
  const id = req.params.itemId
  let path = ''

  try {
    const response = await Item.findById(id).exec()
    path = `./uploadItems/${response.itemImage}`.replace(
      `${process.env.SERVER_URL}uploadItems/`,
      ''
    )
  } catch (err) {
    return res.status(404).json({
      message: 'item not found'
    })
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

  try {
    fs.unlinkSync(path)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log("Image does not exist")
    } else {
      console.log(error)
    }
  }
}
