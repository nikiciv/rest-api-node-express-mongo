const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.post('/signup', UserController.userSignup );

router.post('/login', UserController.userLogin );

router.delete('/:userId', UserController.deleteUser );

module.exports = router;