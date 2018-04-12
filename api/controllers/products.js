const Product = require('../models/product');
const mongoose = require('mongoose');

exports.getAllProducts = (req, res, next) => {
    Product.find()
        .select('price _id name productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })    
};

exports.createProduct = (req, res, next) => {
    
        console.log(req.file);
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
        });
    
        product.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Created product successfuly.',
                    createdProduct: {
                        _id: result._id,
                        name: result.name,
                        price: result.price,
                        productImage: result.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + result._id
                        }
                    }
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({error: err})
            })
}

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('price _id name productImage')
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No valid entry found for provided ID'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
};

exports.updateProduct = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
};

exports.deleteProduct = (req, res, next) => {
    
    Product.remove({_id: req.params.productId})
        .exec()
        .then(result => {
            res.status(200).json({message: 'Product deleted.'});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};