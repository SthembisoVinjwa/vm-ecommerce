const express = require('express')
const router = express.Router()
const orderItemsController = require('../controllers/orderItemsController')

router.post('/', orderItemsController.orderItems_create_order_item);

router.get('/', orderItemsController.orderItems_get_all_order_items);

router.get('/:orderItemId', orderItemsController.orderItems_get_order_item);

router.patch('/:orderItemId', orderItemsController.orderItems_update_order_item);

router.delete('/', orderItemsController.orderItems_delete_all_order_items);

router.delete('/:orderItemId', orderItemsController.orderItems_delete_order_item);

module.exports = router
