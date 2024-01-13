const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.get('/',ordersController.order_get_all_orders);

router.get('/:orderId', ordersController.orders_get_order);

router.post('/', ordersController.orders_create_order);

router.patch('/:orderId', ordersController.orders_update_order);

module.exports = router;