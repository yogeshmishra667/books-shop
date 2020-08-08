const express = require('express');
const ctrl = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/', ctrl.getIndex);
router.get('/products', ctrl.getProducts);
router.get('/products/:productId', ctrl.getProduct);
router.get('/cart', isAuth, ctrl.getShopCart);
router.post('/cart', isAuth, ctrl.postCart);
router.post('/cart-delete-item', isAuth, ctrl.postCartDeleteProduct);
router.get('/orders', isAuth, ctrl.getOrder);
router.post('/create-order', isAuth, ctrl.postOrder);
router.get('/orders/:orderId', isAuth, ctrl.getInvoice);

module.exports = router;
