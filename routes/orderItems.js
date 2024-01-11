const mongoose = require('mongoose');
const Item = require('../models/item');
const OrderItem = require('../models/orderItem');
const express = require('express');
const router = express.Router();



router.post('/', (req, res, next) => {
    Item.findById(req.body.itemId)
    .then(item => {
        if (!item){
            return res.status(404).json({
                message: "product not found"
            })
        }
        const orderItem = new OrderItem({
            _id: new mongoose.Types.ObjectId(),
            item: req.body.itemId,
            quantity: req.body.quantity
        })
        return orderItem.save()
    })
    .then(result => {
        console.log(result)
        res.status(201).json({
            message: "OrderItem created successfully",
            orderItem: {
                _id: result._id,
                item: result.item,
                quantity: result.quantity
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
});

router.get('/', (req, res, next) => {

    OrderItem.find()
    .select('_id item quantity')
    .populate('item', 'name type color itemImage price')
    .exec()
    .then(orderItems => {
        res.status(200).json({
            numberOfOrderItems: orderItems.length,
            orderItems: orderItems.map(orderItem => {
                return {
                    _id: orderItem._id,
                    item: orderItem.item,
                    quantity: orderItem.quantity 
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

});

router.get('/:orderItemId', (req, res, next) => {

    const id = req.params.orderItemId;

    OrderItem.findById(id)
    .select('_id item quantity')
    .populate('item', 'name type color itemImage price')
    .exec()
    .then(result => {
        res.status(200).json({
            message: "OrderItem retrieved successfully",
            orderItem: result
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

});

router.patch('/:orderItemId', (req, res, next) => {

    const id = req.params.orderItemId;
    const updateOps = {};

    for (let i = 0; i < req.body.length; i++) {
        const propName = Object.keys(req.body[i])[0];
        const value = req.body[i][propName];
        updateOps[propName] = value;
    }

    OrderItem.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: `OrderItem with id: ${id} is updated successfully.`
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

});

router.delete('/', (req, res, next) => {

    OrderItem.deleteMany({})
    .exec()
    .then(response => {
        res.status(200).json({
            message: "All OrderItems are deleted Successfully."
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

});

router.delete('/:orderItemId', (req, res, next) => {
    OrderItem.deleteOne({_id: req.params.orderItemId})
    .exec()
    .then(response => {
        res.status(200).json({
            message: `OrderItem with id:${req.params.orderItemId} deleted Successfully.`
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});



module.exports = router;