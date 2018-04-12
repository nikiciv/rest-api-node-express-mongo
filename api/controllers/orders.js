const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.getAllOrders = (req, res, next) => {
    Order.find()
        .populate('product', 'name')
        .select('product _id quantity')
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders' + doc._id 
                        }
                    }
                })
               
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
}

exports.createOrder = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
            return order.save()
        })
       .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Order was created',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders' + result._id 
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
   
}

exports.getOrder = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            if(!order) {
                res.status(404).json({
                    error: 'Order not found!'
                })
            }
            res.status(200).json({
                _id: order._id,
                product: order.product,
                quantity: order.quantity
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

exports.deleteOrder = (req, res, next) => {
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(
            res.status(200).json({
                message: 'Order deleted',
                orderId: req.params.orderId
            })
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}