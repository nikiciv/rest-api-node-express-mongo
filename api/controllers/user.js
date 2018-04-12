const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.userSignup = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user >= 1) {
                return res.status(409).json({
                    message: 'User already exists.'
                })
            } else {
                let hashedPassword = bcrypt.hashSync(req.body.password);
                const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hashedPassword
                        });
                user.save()
                    .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created',
                                    user: {
                                        id: result._id,
                                        email: result.email,
                                        password: result.password
                                    }
                                })
                          })
                    .catch(err => {
                                console.log(err)
                                res.status(500).json({error: err}
                            )}
                    )
            }
        })    
}

exports.userLogin = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    }) 
                }
                if(result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 'secret',
                    {
                        expiresIn: '1h'
                    }); 
                    
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                }) 


            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.deleteUser = (req, res, next) => {
    
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({message: 'User deleted.'});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};