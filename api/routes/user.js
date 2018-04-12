const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
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
});

router.delete('/:userId', (req, res, next) => {
    
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
});

module.exports = router;