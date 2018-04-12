const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null,false); 
    } else {
        //reject a file
        cb(null,true);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
     fileFilter: fileFilter
});

router.get('/', ProductsController.getAllProducts );

router.post('/', checkAuth, upload.single('productImage'), ProductsController.createProduct );

router.get('/:productId', ProductsController.getProduct );

router.patch('/:productId', ProductsController.updateProduct );

router.delete('/:productId', checkAuth, ProductsController.deleteProduct );

module.exports = router;