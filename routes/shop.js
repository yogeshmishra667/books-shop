const express = require('express');
const ctrl = require('../controllers/shop');
const router = express.Router();

router.get('/', ctrl.getIndex);
router.get('/products', ctrl.getProducts);
router.get('/cart', ctrl.getShopCart);
router.get('/orders', ctrl.getOrder);
router.get('/products/:productId', ctrl.getProduct);

//router.get('/cart', ctrl.getCart);

// router.post('/cart', ctrl.postCart);
// router.post('/cart-delete-item', ctrl.postCartDeleteProduct);

//router.post('/create-order', ctrl.postOrder);

module.exports = router;
