const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const { exec } = require('child_process')
const itemsController = require('../controllers/itemsController')
const checkAuth = require('../middleware/checkAuth')

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

router.post('/', checkAuth, upload.single('itemImage'), itemsController.items_create_item)

router.get('/', itemsController.items_get_all_items);

router.get('/:itemId', itemsController.items_get_single_item);

router.patch('/:itemId', checkAuth, itemsController.items_update_item);

router.delete('/:itemId', checkAuth, itemsController.items_delete_single_item);

module.exports = router
