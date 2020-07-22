const express = require('express');
const ctrl = require('../controllers/shop');
const router = express.Router();

router.get('/', ctrl.getIndex);
router.get('/products', ctrl.getProducts);
router.get('/products/:productId', ctrl.getProduct);
router.get('/cart', ctrl.getShopCart);
router.post('/cart', ctrl.postCart);
router.get('/orders', ctrl.getOrder);
// router.post('/cart-delete-item', ctrl.postCartDeleteProduct);

//router.post('/create-order', ctrl.postOrder);

module.exports = router;
