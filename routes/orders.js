const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const checkAuth = require('../middleware/checkAuth')

router.get('/', checkAuth, ordersController.order_get_all_orders);

router.get('/:orderId', checkAuth, ordersController.orders_get_order);

router.post('/', checkAuth, ordersController.orders_create_order);

router.patch('/:orderId', checkAuth, ordersController.orders_update_order);

module.exports = router;